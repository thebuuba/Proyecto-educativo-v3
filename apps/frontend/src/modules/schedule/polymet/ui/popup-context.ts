import * as React from 'react';
export const PopupContext = React.createContext({ open: false, setOpen: (_open: boolean) => {}, triggerRef: { current: null } as React.RefObject<HTMLButtonElement | null>, id: '' });
