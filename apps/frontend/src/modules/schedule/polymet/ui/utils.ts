// Only the variant and utility groups used by the recovered Polymet controls.
type Variants = Record<string, Record<string, string>>;
type Config<V extends Variants> = { variants?: V; defaultVariants?: { [K in keyof V]?: keyof V[K] } };
export type VariantProps<T extends (...args: never[]) => unknown> = Omit<NonNullable<Parameters<T>[0]>, 'className'>;
export function cva<V extends Variants = Record<never, never>>(base: string, config?: Config<V>) {
  return (props: { [K in keyof V]?: keyof V[K] | null } & { className?: string } = {}) => cn(base, ...Object.keys(config?.variants ?? {}).map(key => config?.variants?.[key]?.[String(props[key] ?? config?.defaultVariants?.[key])]), props.className);
}
export function cn(...values: (string | false | null | undefined)[]) {
  const tokens = values.filter(Boolean).join(' ').split(/\s+/).filter(Boolean);
  const group = (token: string) => {
    const parts = token.split(/:(?![^[]*\])/); const utility = parts.pop()!; const prefix = parts.join(':');
    if (/^(static|fixed|absolute|relative|sticky)$/.test(utility)) return `${prefix}:position`;
    if (/^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden|contents|flow-root|table|table-row|table-cell)$/.test(utility)) return `${prefix}:display`;
    if (/^shadow(?:-|$)/.test(utility)) return `${prefix}:shadow-${/^shadow(?:-(xs|sm|md|lg|xl|2xl|none))?$/.test(utility) ? 'size' : 'color'}`;
    if (/^ring-offset-/.test(utility)) return `${prefix}:ring-offset-${/^ring-offset-(\d+|\[.*(?:px|rem)\])$/.test(utility) ? 'width' : 'color'}`;
    if (/^ring(?:-|$)/.test(utility)) return `${prefix}:ring-${/^ring(?:-(\d+|\[.*(?:px|rem)\]))?$/.test(utility) ? 'width' : utility === 'ring-inset' ? 'inset' : 'color'}`;
    const border = utility.match(/^border(?:-([xytrbl]))?(?:-(.+))?$/);
    if (border) return `${prefix}:border-${border[1] ?? 'all'}-${!border[2] || /^(\d+|\[.*(?:px|rem)\])$/.test(border[2]) ? 'width' : /^(solid|dashed|dotted|double|hidden|none)$/.test(border[2]) ? 'style' : 'color'}`;
    const match = utility.match(/^(h|min-h|max-h|w|min-w|max-w|rounded(?:-[trbl]{1,2})?|p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|space-[xy]|font|opacity|leading|tracking)-/);
    const text = /^text-(xs|sm|base|lg|xl|\d+xl|\[.*(?:px|rem)\])$/.test(utility) ? 'text-size' : /^text-(left|center|right|justify|start|end)$/.test(utility) ? 'text-align' : /^text-/.test(utility) ? 'text-color' : '';
    const color = /^bg-/.test(utility) ? 'bg' : '';
    return `${prefix}:${match?.[1] ?? (text || color || utility)}`;
  };
  return tokens.filter((token, index) => !tokens.slice(index + 1).some(next => {
    const currentGroup = group(token), nextGroup = group(next);
    return nextGroup === currentGroup || currentGroup.endsWith(':leading') && nextGroup === currentGroup.replace(/:leading$/, ':text-size');
  })).join(' ');
}
