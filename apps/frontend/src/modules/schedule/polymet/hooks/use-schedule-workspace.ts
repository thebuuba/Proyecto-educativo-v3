import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  AssignableClassOption,
  CreateScheduleEntryInput,
  SaveScheduleStructureInput,
  ScheduleEntry,
  ScheduleWorkspace,
  UpdateScheduleEntryInput,
} from "@/modules/schedule/polymet/lib/schedule-types";
import {
  describeScheduleError,
  type ScheduleDataSource,
} from "@/modules/schedule/polymet/lib/schedule-data-source";

export type MutationResult<T> = { ok: true; data: T } | { ok: false; message: string };

type LoadState =
  | { status: "loading"; workspace: null; error: null }
  | { status: "ready"; workspace: ScheduleWorkspace; error: null }
  | { status: "error"; workspace: ScheduleWorkspace | null; error: string };

/**
 * Orquesta los datos del módulo (equivalente a `useSchedule`).
 * Nunca aplica cambios de forma optimista: cada mutación espera la confirmación
 * del servidor y luego vuelve a leer el workspace.
 */
export function useScheduleWorkspace(source: ScheduleDataSource) {
  const [state, setState] = useState<LoadState>({ status: "loading", workspace: null, error: null });
  const [refreshing, setRefreshing] = useState(false);
  const [assignables, setAssignables] = useState<AssignableClassOption[]>([]);
  const [assignablesError, setAssignablesError] = useState<string | null>(null);
  const [pending, setPending] = useState<Set<string>>(() => new Set());
  const mounted = useRef(true);
  const session = useMemo(() => ({ source, workspaceRequest: 0, assignablesRequest: 0 }), [source]);
  const currentSession = useRef(session);
  currentSession.current = session;
  const isCurrent = useCallback(() => mounted.current && currentSession.current === session, [session]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const setPendingKey = useCallback((key: string, on: boolean) => {
    setPending((prev) => {
      const next = new Set(prev);
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const loadAssignables = useCallback(async () => {
    if (!isCurrent()) return;
    const request = ++session.assignablesRequest;
    try {
      const options = await source.getAssignableClasses();
      if (!isCurrent() || request !== session.assignablesRequest) return;
      setAssignables(options);
      setAssignablesError(null);
    } catch (cause) {
      if (!isCurrent() || request !== session.assignablesRequest) return;
      setAssignablesError(describeScheduleError(cause, "load"));
    }
  }, [source, session, isCurrent]);

  const load = useCallback(
    async (mode: "initial" | "refresh") => {
      if (!isCurrent()) return false;
      const request = ++session.workspaceRequest;
      if (mode === "initial") setState({ status: "loading", workspace: null, error: null });
      else setRefreshing(true);
      try {
        const workspace = await source.getWorkspace();
        if (!isCurrent() || request !== session.workspaceRequest) return false;
        setState({ status: "ready", workspace, error: null });
        if (mode === "refresh") void loadAssignables();
        return true;
      } catch (cause) {
        if (!isCurrent() || request !== session.workspaceRequest) return false;
        setState((prev) => ({ status: "error", workspace: prev.workspace, error: describeScheduleError(cause, "load") }));
        return false;
      } finally {
        if (isCurrent() && request === session.workspaceRequest) setRefreshing(false);
      }
    },
    [source, session, isCurrent, loadAssignables],
  );

  useEffect(() => {
    setAssignables([]);
    setAssignablesError(null);
    setPending(new Set());
    void load("initial");
    void loadAssignables();
  }, [load, loadAssignables]);

  const run = useCallback(
    async <T,>(key: string, action: Parameters<typeof describeScheduleError>[1], task: () => Promise<T>): Promise<MutationResult<T>> => {
      if (!isCurrent()) return { ok: false, message: "La sesión cambió. Vuelve a abrir tu horario." };
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return { ok: false, message: "No tienes conexión. Conservamos tu horario; vuelve a intentarlo cuando recuperes la conexión." };
      }
      setPendingKey(key, true);
      try {
        const data = await task();
        if (!isCurrent()) return { ok: false, message: "La sesión cambió. Vuelve a abrir tu horario." };
        const refreshed = await load("refresh");
        if (!refreshed) return { ok: false, message: "El cambio se guardó, pero no pudimos actualizar tu horario. Vuelve a cargarlo para comprobarlo." };
        return { ok: true, data };
      } catch (cause) {
        return { ok: false, message: describeScheduleError(cause, action) };
      } finally {
        if (isCurrent()) setPendingKey(key, false);
      }
    },
    [load, setPendingKey, isCurrent],
  );

  const assign = useCallback(
    (pendingKey: string, input: CreateScheduleEntryInput): Promise<MutationResult<ScheduleEntry>> =>
      run(pendingKey, "assign", () => source.createEntry(input)),
    [run, source],
  );

  const replace = useCallback(
    (pendingKey: string, id: string, input: UpdateScheduleEntryInput): Promise<MutationResult<ScheduleEntry>> =>
      run(pendingKey, "update", () => source.updateEntry(id, input)),
    [run, source],
  );

  const unassign = useCallback(
    (pendingKey: string, id: string): Promise<MutationResult<void>> => run(pendingKey, "unassign", () => source.deleteEntry(id)),
    [run, source],
  );

  const saveStructure = useCallback(
    (input: SaveScheduleStructureInput) => run("structure", "save-structure", () => source.saveStructure(input)),
    [run, source],
  );

  const resetStructure = useCallback(
    () => run("reset", "delete-structure", () => source.deleteStructure()),
    [run, source],
  );

  return {
    status: state.status,
    workspace: state.workspace,
    error: state.error,
    refreshing,
    assignables,
    assignablesError,
    pending,
    reload: () => load(state.workspace ? "refresh" : "initial"),
    reloadAssignables: loadAssignables,
    assign,
    replace,
    unassign,
    saveStructure,
    resetStructure,
  };
}

export type ScheduleWorkspaceController = ReturnType<typeof useScheduleWorkspace>;
