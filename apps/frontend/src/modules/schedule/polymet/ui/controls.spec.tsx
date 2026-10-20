import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from './alert-dialog';
import * as Dialog from './dialog-primitive';
import { Button } from './button';
afterEach(cleanup);
describe('Polymet controls', () => {
  it('selects with keyboard, skips disabled options and restores focus', async () => {
    const change = vi.fn();
    render(<Select defaultValue="a" onValueChange={change}><SelectTrigger aria-label="Tipo"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="a">Clase</SelectItem><SelectItem value="b" disabled>Deshabilitado</SelectItem><SelectItem value="c">Receso</SelectItem></SelectContent></Select>);
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toBe('Clase'); fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('option', { name: 'Clase' })));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('option', { name: 'Receso' }));
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
    expect(change).toHaveBeenCalledWith('c'); expect(trigger.textContent).toBe('Receso'); expect(document.activeElement).toBe(trigger); expect(screen.queryByRole('listbox')).toBeNull();
  });
  it('opens an asChild menu, activates its action and closes with Escape', async () => {
    const action = vi.fn();
    render(<DropdownMenu><DropdownMenuTrigger asChild><Button>Acciones</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={action}>Editar</DropdownMenuItem></DropdownMenuContent></DropdownMenu>);
    fireEvent.click(screen.getByRole('button', { name: 'Acciones' }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('menuitem')));
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' }); expect(action).toHaveBeenCalledOnce(); expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Acciones' }));
    await waitFor(() => expect(screen.getByRole('menu')).toBeTruthy());
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'Escape' }); expect(screen.queryByRole('menu')).toBeNull();
  });
  it('keeps prevented alert actions open and dismisses only its top dialog', () => {
    function Example() { const [open, setOpen] = useState(true); return <Dialog.Root open><Dialog.Portal><Dialog.Content><Dialog.Title>Constructor</Dialog.Title><Dialog.Description>Horario</Dialog.Description><AlertDialog open={open} onOpenChange={setOpen}><AlertDialogContent><AlertDialogTitle>Confirmar</AlertDialogTitle><AlertDialogDescription>Cambios</AlertDialogDescription><AlertDialogAction onClick={e => e.preventDefault()}>Guardar</AlertDialogAction><AlertDialogCancel>Cancelar</AlertDialogCancel></AlertDialogContent></AlertDialog></Dialog.Content></Dialog.Portal></Dialog.Root>; }
    render(<Example />); expect(document.body.style.overflow).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' })); expect(screen.getByRole('alertdialog')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' }); expect(screen.queryByRole('alertdialog')).toBeNull(); expect(screen.getByRole('dialog')).toBeTruthy(); expect(document.body.style.overflow).toBe('hidden');
    cleanup(); expect(document.body.style.overflow).toBe('');
  });
  it('traps Tab and consumes outside clicks without activating the background', () => {
    const background = vi.fn(); const close = vi.fn();
    render(<><button onClick={background}>Fondo</button><Dialog.Root open onOpenChange={close}><Dialog.Portal><Dialog.Content><Dialog.Title>Editar</Dialog.Title><Dialog.Description>Datos</Dialog.Description><button>Primero</button><button>Último</button></Dialog.Content></Dialog.Portal></Dialog.Root></>);
    screen.getByRole('button', { name: 'Último' }).focus();
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' }); expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Primero' }));
    const outside = screen.getByRole('button', { name: 'Fondo' }); fireEvent.pointerDown(outside); fireEvent.click(outside);
    expect(close).toHaveBeenCalledWith(false); expect(background).not.toHaveBeenCalled();
  });
});
