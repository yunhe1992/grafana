import { css, cx } from '@emotion/css';
import React, { useCallback, useState } from 'react';

import { GrafanaTheme2, colorManipulator, deprecationWarning } from '@grafana/data';

import { useTheme2, stylesFactory } from '../../themes';
import { getFocusStyles, getMouseFocusStyles } from '../../themes/mixins';
import { ComponentSize } from '../../types';
import { IconName, IconSize, IconType } from '../../types/icon';
import { Icon } from '../Icon/Icon';
import { getSvgSize } from '../Icon/utils';
import { TooltipPlacement, PopoverContent, Tooltip } from '../Tooltip';

export type IconButtonVariant = 'primary' | 'secondary' | 'destructive';

type LimitedIconSize = ComponentSize | 'xl';

interface BaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Name of the icon **/
  name: IconName;
  /** Icon size - sizes xxl and xxxl are deprecated and when used being decreased to xl*/
  size?: IconSize;
  /** Type of the icon - mono or default */
  iconType?: IconType;
  /** Variant to change the color of the Icon */
  variant?: IconButtonVariant;
}

interface BasePropsWithTooltip extends BaseProps {
  /** Tooltip content to display on hover */
  tooltip: React.ReactNode;
  /** Position of the tooltip */
  tooltipPlacement?: TooltipPlacement;
  /** Text available only for screen readers. Will use tooltip text as fallback. */
  ariaLabel?: string;
}

interface BasePropsWithAriaLabel extends BaseProps {
  /** Tooltip content to display on hover */
  tooltip?: React.ReactNode;
  /** Position of the tooltip */
  tooltipPlacement?: TooltipPlacement;
  /** Text available only for screen readers. Will use tooltip text as fallback. */
  ariaLabel: string;
}

export type Props = BasePropsWithTooltip | BasePropsWithAriaLabel;

export const IconButton = React.forwardRef<HTMLButtonElement, BasePropsWithTooltip | BasePropsWithAriaLabel>(
  (
    {
      name,
      size = 'md',
      iconType,
      tooltip,
      tooltipPlacement,
      ariaLabel,
      className,
      variant = 'secondary',
      ...restProps
    },
    ref
  ) => {
    const theme = useTheme2();
    let limitedIconSize: LimitedIconSize;

    // very large icons (xl to xxxl) are unified to size xl
    if (size === 'xxl' || size === 'xxxl') {
      deprecationWarning('IconButton', 'size="xxl" and size="xxxl"', 'size="xl"');
      limitedIconSize = 'xl';
    } else {
      limitedIconSize = size;
    }

    const [tooltipShown, setTooltipShown] = useState(false);

    const styles = getStyles(theme, limitedIconSize, variant);
    const tooltipString = typeof tooltip === 'string' ? tooltip : '';

    const handleVisibleChange = useCallback((visible: boolean) => {
      setTooltipShown(visible);
    }, []);

    // When using tooltip, ref is forwarded to Tooltip component instead for https://github.com/grafana/grafana/issues/65632
    const button = (
      <button
        ref={tooltip ? undefined : ref}
        {...restProps}
        className={cx(styles.button, className)}
        type="button"
        aria-labelledby={'tooltip-body'}
      >
        <Icon name={name} size={limitedIconSize} className={styles.icon} type={iconType} />
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip
          onTooltipVisible={handleVisibleChange}
          ref={ref}
          content={<span id="tooltip-body">{tooltip}</span>}
          placement={tooltipPlacement}
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

IconButton.displayName = 'IconButton';

const getStyles = stylesFactory((theme: GrafanaTheme2, size, variant: IconButtonVariant) => {
  // overall size of the IconButton on hover
  // theme.spacing.gridSize originates from 2*4px for padding and letting the IconSize generally decide on the hoverSize
  const hoverSize = getSvgSize(size) + theme.spacing.gridSize;

  let iconColor = theme.colors.text.primary;

  if (variant === 'primary') {
    iconColor = theme.colors.primary.text;
  } else if (variant === 'destructive') {
    iconColor = theme.colors.error.text;
  }

  return {
    button: css`
      z-index: 0;
      position: relative;
      margin: 0 ${theme.spacing(0.5)} 0 0;
      box-shadow: none;
      border: none;
      display: inline-flex;
      background: transparent;
      justify-content: center;
      align-items: center;
      padding: 0;
      color: ${iconColor};

      &[disabled],
      &:disabled {
        cursor: not-allowed;
        color: ${theme.colors.action.disabledText};
        opacity: 0.65;
      }

      &:before {
        z-index: -1;
        position: absolute;
        opacity: 0;
        width: ${hoverSize}px;
        height: ${hoverSize}px;
        border-radius: ${theme.shape.radius.default};
        content: '';
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-property: opacity;
      }

      &:focus,
      &:focus-visible {
        ${getFocusStyles(theme)}
      }

      &:focus:not(:focus-visible) {
        ${getMouseFocusStyles(theme)}
      }

      &:hover {
        &:before {
          background-color: ${variant === 'secondary'
            ? theme.colors.action.hover
            : colorManipulator.alpha(iconColor, 0.12)};
          opacity: 1;
        }
      }
    `,
    icon: css`
      vertical-align: baseline;
    `,
  };
});
