import * as React from 'react';
export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ children, ...props }, ref) => {
  if (!React.isValidElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>(children)) return null;
  const child = children.props;
  return React.cloneElement(children, { ...props, ...child, ref, className: [props.className, child.className].filter(Boolean).join(' '), onClick: event => { child.onClick?.(event); if (!event.defaultPrevented) props.onClick?.(event); } });
});
