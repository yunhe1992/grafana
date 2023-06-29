package util

import (
	"hash/fnv"
	"sort"
	"unsafe"

	"github.com/grafana/grafana-plugin-sdk-go/data"
)

var fingerprintSeparator = []byte{255}

// TODO replace with data.Labels.Fingerprint()
func CalculateFingerprintForLabels(l data.Labels) uint64 {
	h := fnv.New64()
	// maps do not guarantee predictable sequence of keys.
	// Therefore, to make hash stable, we need to sort keys
	if len(l) == 0 {
		return h.Sum64()
	}
	keys := make([]string, 0, len(l))
	for labelName := range l {
		keys = append(keys, labelName)
	}
	sort.Strings(keys)
	for _, name := range keys {
		_, _ = h.Write(unsafe.Slice(unsafe.StringData(name), len(name)))
		_, _ = h.Write(fingerprintSeparator)
		value := l[name]
		_, _ = h.Write(unsafe.Slice(unsafe.StringData(value), len(value)))
		_, _ = h.Write(fingerprintSeparator)
	}
	return h.Sum64()
}
