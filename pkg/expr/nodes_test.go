package expr

import (
	"errors"
	"fmt"
	"math/rand"
	"testing"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type expectedError struct{}

func (e expectedError) Error() string {
	return "expected"
}

func TestQueryError_Error(t *testing.T) {
	e := QueryError{
		RefID: "A",
		Err:   errors.New("this is an error message"),
	}
	assert.EqualError(t, e, "failed to execute query A: this is an error message")
}

func TestQueryError_Unwrap(t *testing.T) {
	t.Run("errors.Is", func(t *testing.T) {
		expectedIsErr := errors.New("expected")
		e := QueryError{
			RefID: "A",
			Err:   expectedIsErr,
		}
		assert.True(t, errors.Is(e, expectedIsErr))
	})

	t.Run("errors.As", func(t *testing.T) {
		e := QueryError{
			RefID: "A",
			Err:   expectedError{},
		}
		var expectedAsError expectedError
		assert.True(t, errors.As(e, &expectedAsError))
	})
}

func TestWideToMany(t *testing.T) {
	f := data.NewFrame("Test",
		data.NewField("Time", nil, []time.Time{}))
	for i := 0; i < 10; i++ {
		lbls := make(data.Labels, 5)
		for j := 0; j < 5; j++ {
			lbls[fmt.Sprintf("lbl%d", j)] = fmt.Sprintf("value%d", i)
		}
		f.Fields = append(f.Fields, data.NewField(fmt.Sprintf("val-%d", i), lbls, []*float64{}))
	}
	for i := 0; i < 100; i++ {
		row := make([]interface{}, 0, len(f.Fields))
		row = append(row, time.Now().Add(-time.Duration(i)))
		for j := 1; j < cap(row); j++ {
			v := rand.Float64()
			row = append(row, &v)
		}
		f.AppendRow(row...)
	}

	ser, err := WideToMany(f)
	if err != nil {
		require.NoError(t, err)
	}
	require.Len(t, ser, 10)

	timeField := f.Fields[0]
	for idx, series := range ser {
		field := f.Fields[idx+1]
		require.Equal(t, field.Len(), series.Len())
		require.EqualValues(t, field.Labels, series.GetLabels())
		for i := 0; i < field.Len(); i++ {
			actualTime, actualValue := series.GetPoint(i)
			require.EqualValues(t, timeField.At(i), actualTime)
			require.EqualValues(t, field.At(i), actualValue)
		}
	}
}
