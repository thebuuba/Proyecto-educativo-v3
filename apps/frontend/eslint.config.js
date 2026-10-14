import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }],
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['src/modules/activities/components/editor/*.tsx', 'src/modules/grading/components/GradingBook.tsx'],
    rules: {
      // Established editor modules also expose shared helpers to their sibling views.
      'react-refresh/only-export-components': ['error', { allowConstantExport: true, allowExportNames: [
          'activityDescriptionText', 'activityMomentTitle', 'activityRubricConfiguration', 'activityToDraft',
          'allCatalogResources', 'automaticRubricLevelDrafts', 'availablePedagogicalActivityType', 'blockAccents',
          'blockShortNames', 'buildActivityDraftMeta', 'buildActivityDraftMetas', 'checklistLabelMode',
          'checklistResponsePresets', 'commonActivityResources', 'completionIssueVisual', 'createDraftId',
          'criterionPointsMaximum', 'defaultRubricLevelPoints', 'defaultRubricStructure', 'descriptionToEditorHtml',
          'distributeScore', 'draftMissingSummary', 'draftToActivity', 'duplicateInstrumentRow',
          'emptyActivityDraft', 'evaluationTechniqueOptions', 'focusNewInstrumentRow', 'formatActivityDate',
          'formatActivityTechnique', 'formatDraftDate', 'formatInstrumentNumber', 'getBlockAccent',
          'hasInstrumentField', 'inferInstrumentCount', 'inferRubricLevels', 'inferWeightedLabelTemplate',
          'instrumentConfiguredValue', 'instrumentFieldKey', 'instrumentTextAlign', 'instrumentTextSize',
          'instrumentTitle', 'instrumentTypographyClass', 'isInstrumentComplete', 'isMeaningfulActivityDraft',
          'newActivityDraft', 'normalizeEditorUrl', 'normalizeStoredActivityDrafts', 'pedagogicalActivityLabels',
          'rebalanceInstrumentRows', 'remapInstrumentRows', 'resourceBankCategories', 'resourceCategoryIcon',
          'resourceIcon', 'resourceIconColor', 'rubricDefaultLevelNames', 'rubricLevelPalette',
          'rubricLevelVisual', 'sanitizeActivityDescriptionHtml', 'scaleLevelVisual', 'scaleTemplateLevels',
          'scaleTemplateOptions', 'setDragDocumentState', 'shiftInstrumentRows', 'sortDraftMetas',
          'swapInstrumentRows', 'transientHighlightClass', 'useActivityEditorProfile', 'useTransientActivityHighlight',
          'validateActivityCompletion', 'weightedLabelTemplates', 'weightedResponseVisual', 'weightedStatus',
      ] }],
    },
  },
  {
    files: ['src/modules/journal/pages/JournalPage.tsx'],
    rules: {
      'react-refresh/only-export-components': ['error', { allowExportNames: ['journalEntryTypeLabel'] }],
    },
  },
])
