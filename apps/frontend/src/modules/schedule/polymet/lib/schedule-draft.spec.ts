import { describe, expect, it } from 'vitest';
import { createJourney, draftFromWorkspace, resolveDayBlocks, structureImpact, toStructureInput, type ScheduleDraft } from './schedule-draft';
import type { ScheduleEntry, ScheduleWorkspace, TimeSlot } from './schedule-types';

const slot = (id = 'slot-1', patch: Partial<TimeSlot> = {}): TimeSlot => ({ id, name: 'Período 1', startTime: '08:00:00', endTime: '08:45:00', sequence: 1, status: 'ACTIVE', dayOfWeek: 2, blockType: 'CLASS', journeyId: 'morning', blockSource: 'MANUAL', ...patch });
const workspace = (slots: TimeSlot[] = [slot()]): ScheduleWorkspace => ({ currentSchoolYear: null, timeSlots: slots, journeys: [{ id: 'morning', name: 'Mañana', kind: 'MORNING', startTime: '08:00:00', endTime: '08:45:00', sequence: 1, status: 'ACTIVE' }], entries: [], sections: [], teachers: [], subjects: [] });
const entry = (id: string, patch: Partial<ScheduleEntry> & { needsPlacement?: boolean } = {}): ScheduleEntry => ({ id, timeSlotId: 'slot-1', dayOfWeek: 2, startTime: '08:00:00', endTime: '08:45:00', ...patch } as ScheduleEntry);

describe('Polymet draft persistence', () => {
  it('keeps initial IDs and metadata, including retiming an explicit block', () => {
    const source = workspace([slot('slot-1', { name: 'Clase especial' })]);
    const draft = draftFromWorkspace(source);
    expect(draft.days).toEqual([2]);
    expect(resolveDayBlocks(draft, 2)[0]).toMatchObject({ id: 'slot-1', name: 'Clase especial' });
    draft.customBlocks[2] = resolveDayBlocks(draft, 2).map(b => ({ ...b, startTime: '08:05', endTime: '08:50' }));
    expect(toStructureInput(draft, source.timeSlots).blocks[0].id).toBe('slot-1');
  });

  it('never gives a deleted block identity to its replacement or a regenerated period', () => {
    const source = workspace();
    const draft = draftFromWorkspace(source);
    const original = resolveDayBlocks(draft, 2)[0];
    draft.customBlocks[2] = [{ ...original, id: undefined, key: 'new-block' }];
    expect(toStructureInput(draft, source.timeSlots).blocks[0].id).toBeUndefined();
    draft.customBlocks = {};
    draft.journeys[0].startTime = '08:10';
    draft.journeys[0].endTime = '08:55';
    expect(toStructureInput(draft, source.timeSlots).blocks[0].id).toBeUndefined();
  });

  it('does not transfer IDs across days, journeys, inactive slots or class conversion', () => {
    const source = workspace();
    const original = resolveDayBlocks(draftFromWorkspace(source), 2)[0];
    for (const patch of [{ journeyKey: 'other' }, { blockType: 'BREAK' as const }]) {
      const draft = draftFromWorkspace(source);
      draft.journeys.push({ ...draft.journeys[0], key: 'other' });
      draft.customBlocks[2] = [{ ...original, id: 'slot-1', ...patch }];
      expect(toStructureInput(draft, source.timeSlots).blocks[0].id).toBeUndefined();
    }
    const draft = draftFromWorkspace(source);
    draft.days = [3]; draft.journeys[0].days = [3]; draft.customBlocks[3] = [{ ...original, id: 'slot-1' }];
    expect(toStructureInput(draft, source.timeSlots).blocks[0].id).toBeUndefined();
    draft.days = [2]; draft.journeys[0].days = [2]; draft.customBlocks[2] = [{ ...original, id: 'slot-1' }];
    expect(toStructureInput(draft, [slot('slot-1', { status: 'INACTIVE' })]).blocks[0].id).toBeUndefined();
  });

  it('counts existing pending classes once and does not promise to place them', () => {
    const source = { ...workspace(), entries: [entry('placed'), entry('pending', { needsPlacement: true })], pendingEntries: [entry('pending', { needsPlacement: true }), entry('pending-only', { needsPlacement: true })] };
    const input = toStructureInput(draftFromWorkspace(source), source.timeSlots);
    expect(structureImpact(input, source)).toEqual({ kept: 1, displaced: 2, retimed: 0 });
  });

  it('keeps journey days from real slots and does not generate classes for unused journeys', () => {
    const source = workspace();
    source.journeys!.push({ ...source.journeys![0], id: 'unused', startTime: '10:00', endTime: '10:45', sequence: 2 });
    const draft = draftFromWorkspace(source);
    expect(draft.journeys.find(j => j.key === 'unused')).toBeUndefined();
    expect(toStructureInput(draft, source.timeSlots).journeys.map(j => j.id)).toEqual(['morning']);
  });

  it('ignores inactive structure and does not invent an invalid all-archived journey', () => {
    const draft = draftFromWorkspace(workspace([slot('old', { status: 'INACTIVE' })]));
    expect(draft.days).toEqual([1, 2, 3, 4, 5]);
    expect(draft.journeys[0].startTime).not.toContain('NaN');
  });

  it('materializes legacy shared slots without reusing a null-day ID', () => {
    const source = workspace([slot('legacy', { dayOfWeek: null, journeyId: null })]);
    const draft = draftFromWorkspace(source);
    expect(toStructureInput(draft, source.timeSlots).blocks.every(b => !b.id)).toBe(true);
    expect(toStructureInput(draft, source.timeSlots).blocks.every(b => draft.journeys.some(j => j.key === b.journeyKey))).toBe(true);
  });

  it('uses generated GAP provenance only for a valid adjacent journey pair', () => {
    const morning = { ...createJourney('MORNING', [2]), key: 'morning', startTime: '08:00', endTime: '08:45', breaks: [] };
    const afternoon = { ...morning, key: 'afternoon', startTime: '10:00', endTime: '10:45' };
    const night = { ...morning, key: 'night', days: [3], startTime: '09:00', endTime: '09:45' };
    const draft: ScheduleDraft = { days: [2, 3], journeys: [morning, night, afternoon], customBlocks: {} };
    const input = toStructureInput(draft, []);
    expect(input.blocks.find(b => b.blockType === 'GAP')).toMatchObject({ blockSource: 'MANUAL' });
    draft.journeys = [morning, afternoon]; draft.days = [2];
    expect(toStructureInput(draft, []).blocks.find(b => b.blockType === 'GAP')).toMatchObject({ blockSource: 'INTER_JOURNEY_GAP', sourceKey: 'morning:afternoon', journeyKey: 'morning' });
  });
});
