export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      academic_periods: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          school_id: string
          school_year_id: string
          sequence: number
          start_date: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          school_id?: string
          school_year_id: string
          sequence: number
          start_date: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          school_id?: string
          school_year_id?: string
          sequence?: number
          start_date?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_periods_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_academic_periods_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      app_users: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_login_at: string | null
          phone: string | null
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          last_login_at?: string | null
          phone?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_login_at?: string | null
          phone?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_app_users_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_class: {
        Row: {
          academic_period_id: string
          attendance_date: string
          created_at: string
          enrollment_id: string
          id: string
          notes: string | null
          recorded_by: string | null
          school_id: string
          school_year_id: string
          section_id: string
          section_subject_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
        }
        Insert: {
          academic_period_id: string
          attendance_date: string
          created_at?: string
          enrollment_id: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          school_id?: string
          school_year_id: string
          section_id: string
          section_subject_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Update: {
          academic_period_id?: string
          attendance_date?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          school_id?: string
          school_year_id?: string
          section_id?: string
          section_subject_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_enrollment_fk"
            columns: ["enrollment_id", "school_year_id", "section_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id", "school_year_id", "section_id"]
          },
          {
            foreignKeyName: "attendance_class_period_fk"
            columns: ["academic_period_id", "school_year_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id", "school_year_id"]
          },
          {
            foreignKeyName: "attendance_class_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_class_section_subject_fk"
            columns: ["section_subject_id", "school_year_id", "section_id"]
            isOneToOne: false
            referencedRelation: "section_subjects"
            referencedColumns: ["id", "school_year_id", "section_id"]
          },
          {
            foreignKeyName: "fk_attendance_class_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_daily: {
        Row: {
          academic_period_id: string
          attendance_date: string
          created_at: string
          enrollment_id: string
          id: string
          notes: string | null
          recorded_by: string | null
          school_id: string
          school_year_id: string
          section_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
        }
        Insert: {
          academic_period_id: string
          attendance_date: string
          created_at?: string
          enrollment_id: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          school_id?: string
          school_year_id: string
          section_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Update: {
          academic_period_id?: string
          attendance_date?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          notes?: string | null
          recorded_by?: string | null
          school_id?: string
          school_year_id?: string
          section_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_daily_enrollment_fk"
            columns: ["enrollment_id", "school_year_id", "section_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id", "school_year_id", "section_id"]
          },
          {
            foreignKeyName: "attendance_daily_period_fk"
            columns: ["academic_period_id", "school_year_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id", "school_year_id"]
          },
          {
            foreignKeyName: "attendance_daily_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attendance_daily_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          priority: string
          school_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          priority?: string
          school_id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          priority?: string
          school_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_tasks_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      dr_academic_levels: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          sequence: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          sequence: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          sequence?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      dr_academic_cycles: {
        Row: {
          code: string
          created_at: string
          grade_sequence_from: number | null
          grade_sequence_to: number | null
          id: string
          level_id: string
          name: string
          sequence: number
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          grade_sequence_from?: number | null
          grade_sequence_to?: number | null
          id?: string
          level_id: string
          name: string
          sequence: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          grade_sequence_from?: number | null
          grade_sequence_to?: number | null
          id?: string
          level_id?: string
          name?: string
          sequence?: number
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      dr_competencies: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      dr_evaluation_rules: {
        Row: {
          created_at: string
          id: string
          level_id: string | null
          max_score: number
          min_passing_percent: number
          modality_id: string | null
          name: string
          period_scheme: string
          promotion_requires_all_subjects: boolean
          recovery_enabled: boolean
          school_id: string | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level_id?: string | null
          max_score?: number
          min_passing_percent?: number
          modality_id?: string | null
          name: string
          period_scheme?: string
          promotion_requires_all_subjects?: boolean
          recovery_enabled?: boolean
          school_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level_id?: string | null
          max_score?: number
          min_passing_percent?: number
          modality_id?: string | null
          name?: string
          period_scheme?: string
          promotion_requires_all_subjects?: boolean
          recovery_enabled?: boolean
          school_id?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      dr_modalities: {
        Row: {
          applies_from_grade_sequence: number | null
          applies_to_grade_sequence: number | null
          code: string
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          applies_from_grade_sequence?: number | null
          applies_to_grade_sequence?: number | null
          code: string
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          applies_from_grade_sequence?: number | null
          applies_to_grade_sequence?: number | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      dr_subsystems: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          academic_cycle_id: string | null
          academic_level_id: string | null
          academic_status: string
          created_at: string
          enrollment_date: string
          final_condition: string | null
          grade_id: string
          id: string
          is_repeating: boolean
          modality_id: string | null
          promotion_status: string | null
          school_id: string
          school_year_id: string
          section_id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          subsystem_id: string | null
          transfer_notes: string | null
          updated_at: string
        }
        Insert: {
          academic_cycle_id?: string | null
          academic_level_id?: string | null
          academic_status?: string
          created_at?: string
          enrollment_date?: string
          final_condition?: string | null
          grade_id: string
          id?: string
          is_repeating?: boolean
          modality_id?: string | null
          promotion_status?: string | null
          school_id?: string
          school_year_id: string
          section_id: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          subsystem_id?: string | null
          transfer_notes?: string | null
          updated_at?: string
        }
        Update: {
          academic_cycle_id?: string | null
          academic_level_id?: string | null
          academic_status?: string
          created_at?: string
          enrollment_date?: string
          final_condition?: string | null
          grade_id?: string
          id?: string
          is_repeating?: boolean
          modality_id?: string | null
          promotion_status?: string | null
          school_id?: string
          school_year_id?: string
          section_id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
          subsystem_id?: string | null
          transfer_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_section_grade_fk"
            columns: ["section_id", "grade_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id", "grade_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollments_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          academic_cycle_id: string | null
          academic_level_id: string | null
          created_at: string
          default_modality_id: string | null
          id: string
          level: string | null
          name: string
          school_id: string
          sequence: number | null
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          academic_cycle_id?: string | null
          academic_level_id?: string | null
          created_at?: string
          default_modality_id?: string | null
          id?: string
          level?: string | null
          name: string
          school_id?: string
          sequence?: number | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          academic_cycle_id?: string | null
          academic_level_id?: string | null
          created_at?: string
          default_modality_id?: string | null
          id?: string
          level?: string | null
          name?: string
          school_id?: string
          sequence?: number | null
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_grades_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      grades_records: {
        Row: {
          academic_period_id: string
          assessment_name: string
          created_at: string
          enrollment_id: string
          id: string
          max_score: number
          recorded_by: string | null
          school_id: string
          school_year_id: string
          score: number
          section_id: string
          section_subject_id: string
          status: Database["public"]["Enums"]["grade_record_status"]
          updated_at: string
          weight: number
        }
        Insert: {
          academic_period_id: string
          assessment_name: string
          created_at?: string
          enrollment_id: string
          id?: string
          max_score?: number
          recorded_by?: string | null
          school_id?: string
          school_year_id: string
          score: number
          section_id: string
          section_subject_id: string
          status?: Database["public"]["Enums"]["grade_record_status"]
          updated_at?: string
          weight?: number
        }
        Update: {
          academic_period_id?: string
          assessment_name?: string
          created_at?: string
          enrollment_id?: string
          id?: string
          max_score?: number
          recorded_by?: string | null
          school_id?: string
          school_year_id?: string
          score?: number
          section_id?: string
          section_subject_id?: string
          status?: Database["public"]["Enums"]["grade_record_status"]
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_grades_records_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_records_enrollment_fk"
            columns: ["enrollment_id", "school_year_id", "section_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id", "school_year_id", "section_id"]
          },
          {
            foreignKeyName: "grades_records_period_fk"
            columns: ["academic_period_id", "school_year_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id", "school_year_id"]
          },
          {
            foreignKeyName: "grades_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_records_section_subject_fk"
            columns: ["section_subject_id", "school_year_id", "section_id"]
            isOneToOne: false
            referencedRelation: "section_subjects"
            referencedColumns: ["id", "school_year_id", "section_id"]
          },
        ]
      }
      guardians: {
        Row: {
          address: string | null
          created_at: string
          document_id: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          document_id?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          document_id?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_guardians_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardians_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      pedagogical_recoveries: {
        Row: {
          created_at: string
          grade_record_id: string
          id: string
          reason: string | null
          recorded_by: string | null
          recovery_date: string
          recovery_score: number
          school_id: string
          status: Database["public"]["Enums"]["grade_record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade_record_id: string
          id?: string
          reason?: string | null
          recorded_by?: string | null
          recovery_date?: string
          recovery_score: number
          school_id?: string
          status?: Database["public"]["Enums"]["grade_record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade_record_id?: string
          id?: string
          reason?: string | null
          recorded_by?: string | null
          recovery_date?: string
          recovery_score?: number
          school_id?: string
          status?: Database["public"]["Enums"]["grade_record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedagogical_recoveries_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedagogical_recoveries_grade_record_id_fkey"
            columns: ["grade_record_id"]
            isOneToOne: true
            referencedRelation: "grades_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedagogical_recoveries_grade_record_id_fkey"
            columns: ["grade_record_id"]
            isOneToOne: true
            referencedRelation: "student_grade_details"
            referencedColumns: ["grade_record_id"]
          },
          {
            foreignKeyName: "pedagogical_recoveries_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          name: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          name: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          name?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      planning_entries: {
        Row: {
	          academic_period_id: string
	          achievement_indicator: string
	          activities: Json
	          content_attitudinal: string
	          content_conceptual: string
	          content_procedural: string
	          created_at: string
	          duration_minutes: number | null
	          evaluation_instruments: string
	          evaluation_method: string
	          evidence: string
	          fundamental_competence_id: string | null
	          id: string
          planned_date: string | null
          resources: string
          school_id: string
          section_subject_id: string
          sequence: number
          specific_competence: string
          status: Database["public"]["Enums"]["record_status"]
          strategies: string
          title: string
          updated_at: string
        }
        Insert: {
	          academic_period_id: string
	          achievement_indicator?: string
	          activities?: Json
	          content_attitudinal?: string
	          content_conceptual?: string
	          content_procedural?: string
	          created_at?: string
	          duration_minutes?: number | null
	          evaluation_instruments?: string
	          evaluation_method?: string
	          evidence?: string
	          fundamental_competence_id?: string | null
	          id?: string
          planned_date?: string | null
          resources?: string
          school_id?: string
          section_subject_id: string
          sequence?: number
          specific_competence?: string
          status?: Database["public"]["Enums"]["record_status"]
          strategies?: string
          title: string
          updated_at?: string
        }
        Update: {
	          academic_period_id?: string
	          achievement_indicator?: string
	          activities?: Json
	          content_attitudinal?: string
	          content_conceptual?: string
	          content_procedural?: string
	          created_at?: string
	          duration_minutes?: number | null
	          evaluation_instruments?: string
	          evaluation_method?: string
	          evidence?: string
	          fundamental_competence_id?: string | null
	          id?: string
          planned_date?: string | null
          resources?: string
          school_id?: string
          section_subject_id?: string
          sequence?: number
          specific_competence?: string
          status?: Database["public"]["Enums"]["record_status"]
          strategies?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_entries_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
	          {
	            foreignKeyName: "planning_entries_fundamental_competence_id_fkey"
	            columns: ["fundamental_competence_id"]
	            isOneToOne: false
	            referencedRelation: "dr_competencies"
	            referencedColumns: ["id"]
	          },
	          {
	            foreignKeyName: "planning_entries_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planning_entries_section_subject_id_fkey"
            columns: ["section_subject_id"]
            isOneToOne: false
            referencedRelation: "section_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          academic_period_id: string | null
          created_at: string
          file_url: string | null
          generated_by: string | null
          id: string
          parameters: Json
          report_type: string
          school_id: string
          school_year_id: string | null
          status: Database["public"]["Enums"]["report_status"]
          student_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          academic_period_id?: string | null
          created_at?: string
          file_url?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json
          report_type: string
          school_id?: string
          school_year_id?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          student_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          academic_period_id?: string | null
          created_at?: string
          file_url?: string | null
          generated_by?: string | null
          id?: string
          parameters?: Json
          report_type?: string
          school_id?: string
          school_year_id?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          student_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_reports_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_period_year_fk"
            columns: ["academic_period_id", "school_year_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id", "school_year_id"]
          },
          {
            foreignKeyName: "reports_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          name: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          name: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          name?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      schedule_entries: {
        Row: {
          academic_period_id: string | null
          created_at: string
          day_of_week: number
          id: string
          room: string | null
          school_id: string
          school_year_id: string
          section_id: string
          section_subject_id: string
          status: Database["public"]["Enums"]["record_status"]
          time_slot_id: string
          updated_at: string
        }
        Insert: {
          academic_period_id?: string | null
          created_at?: string
          day_of_week: number
          id?: string
          room?: string | null
          school_id?: string
          school_year_id: string
          section_id: string
          section_subject_id: string
          status?: Database["public"]["Enums"]["record_status"]
          time_slot_id: string
          updated_at?: string
        }
        Update: {
          academic_period_id?: string | null
          created_at?: string
          day_of_week?: number
          id?: string
          room?: string | null
          school_id?: string
          school_year_id?: string
          section_id?: string
          section_subject_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          time_slot_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_entries_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_section_fk"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_section_subject_id_fkey"
            columns: ["section_subject_id"]
            isOneToOne: false
            referencedRelation: "section_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      school_years: {
        Row: {
          calendar_source: string
          created_at: string
          end_date: string
          id: string
          instructional_days: number | null
          is_current: boolean
          name: string
          period_count: number
          period_scheme: string
          school_id: string
          student_weeks: number | null
          start_date: string
          status: Database["public"]["Enums"]["record_status"]
          teacher_weeks: number | null
          updated_at: string
        }
        Insert: {
          calendar_source?: string
          created_at?: string
          end_date: string
          id?: string
          instructional_days?: number | null
          is_current?: boolean
          name: string
          period_count?: number
          period_scheme?: string
          school_id?: string
          student_weeks?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["record_status"]
          teacher_weeks?: number | null
          updated_at?: string
        }
        Update: {
          calendar_source?: string
          created_at?: string
          end_date?: string
          id?: string
          instructional_days?: number | null
          is_current?: boolean
          name?: string
          period_count?: number
          period_scheme?: string
          school_id?: string
          student_weeks?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["record_status"]
          teacher_weeks?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_school_years_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          center_code: string | null
          created_at: string
          district_code: string | null
          district_name: string | null
          enabled_subsystems: string[]
          id: string
          logo_url: string | null
          name: string
          official_exports_enabled: boolean
          primary_modality: string
          regional_code: string | null
          regional_name: string | null
          school_shift: string
          sector: string
          slug: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          center_code?: string | null
          created_at?: string
          district_code?: string | null
          district_name?: string | null
          enabled_subsystems?: string[]
          id?: string
          logo_url?: string | null
          name: string
          official_exports_enabled?: boolean
          primary_modality?: string
          regional_code?: string | null
          regional_name?: string | null
          school_shift?: string
          sector?: string
          slug: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          center_code?: string | null
          created_at?: string
          district_code?: string | null
          district_name?: string | null
          enabled_subsystems?: string[]
          id?: string
          logo_url?: string | null
          name?: string
          official_exports_enabled?: boolean
          primary_modality?: string
          regional_code?: string | null
          regional_name?: string | null
          school_shift?: string
          sector?: string
          slug?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: []
      }
      section_subjects: {
        Row: {
          created_at: string
          grade_id: string
          id: string
          school_id: string
          school_year_id: string
          section_id: string
          status: Database["public"]["Enums"]["record_status"]
          subject_id: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade_id: string
          id?: string
          school_id?: string
          school_year_id: string
          section_id: string
          status?: Database["public"]["Enums"]["record_status"]
          subject_id: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade_id?: string
          id?: string
          school_id?: string
          school_year_id?: string
          section_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          subject_id?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_section_subjects_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_subjects_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_subjects_school_year_id_fkey"
            columns: ["school_year_id"]
            isOneToOne: false
            referencedRelation: "school_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_subjects_section_grade_fk"
            columns: ["section_id", "grade_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id", "grade_id"]
          },
          {
            foreignKeyName: "section_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          capacity: number | null
          created_at: string
          grade_id: string
          id: string
          name: string
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          grade_id: string
          id?: string
          name: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          grade_id?: string
          id?: string
          name?: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sections_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sections_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
        ]
      }
      student_guardians: {
        Row: {
          can_pick_up: boolean
          created_at: string
          guardian_id: string
          is_primary: boolean
          relationship: string
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          can_pick_up?: boolean
          created_at?: string
          guardian_id: string
          is_primary?: boolean
          relationship: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          can_pick_up?: boolean
          created_at?: string
          guardian_id?: string
          is_primary?: boolean
          relationship?: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_student_guardians_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_guardians_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          birth_date: string
          created_at: string
          document_id: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          student_code: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          created_at?: string
          document_id?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          student_code: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          created_at?: string
          document_id?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          student_code?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_students_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          credits: number | null
          description: string | null
          id: string
          name: string
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          name?: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subjects_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string
          document_id: string | null
          email: string | null
          employee_code: string
          first_name: string
          gender: string | null
          hire_date: string | null
          id: string
          last_name: string
          phone: string | null
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          document_id?: string | null
          email?: string | null
          employee_code: string
          first_name: string
          gender?: string | null
          hire_date?: string | null
          id?: string
          last_name: string
          phone?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          document_id?: string | null
          email?: string | null
          employee_code?: string
          first_name?: string
          gender?: string | null
          hire_date?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_teachers_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          created_at: string
          end_time: string
          id: string
          name: string
          school_id: string
          sequence: number
          start_time: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          name: string
          school_id?: string
          sequence: number
          start_time: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          name?: string
          school_id?: string
          sequence?: number
          start_time?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          role_id: string
          school_id: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role_id: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role_id?: string
          school_id?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_school"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      student_final_grades: {
        Row: {
          academic_period_id: string | null
          final_average_percent: number | null
          grade_id: string | null
          school_year_id: string | null
          section_id: string | null
          student_id: string | null
          subject_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_records_period_fk"
            columns: ["academic_period_id", "school_year_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id", "school_year_id"]
          },
          {
            foreignKeyName: "section_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_yearly_averages: {
        Row: {
	          all_periods_passing: boolean | null
	          grade_id: string | null
	          min_passing_percent: number | null
	          period_count: number | null
          school_year_id: string | null
          section_id: string | null
          student_id: string | null
          subject_id: string | null
          yearly_average_percent: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_grade_details: {
        Row: {
	          academic_period_id: string | null
	          assessment_name: string | null
	          created_at: string | null
	          effective_percent: number | null
	          effective_score: number | null
	          enrollment_id: string | null
	          grade_id: string | null
	          grade_record_id: string | null
          grade_status:
            | Database["public"]["Enums"]["grade_record_status"]
            | null
          max_score: number | null
          original_percent: number | null
          original_score: number | null
          recovery_score: number | null
	          recovery_status:
	            | Database["public"]["Enums"]["grade_record_status"]
	            | null
	          school_id: string | null
	          school_year_id: string | null
          section_id: string | null
          section_subject_id: string | null
          student_id: string | null
          subject_id: string | null
          updated_at: string | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_records_period_fk"
            columns: ["academic_period_id", "school_year_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id", "school_year_id"]
          },
          {
            foreignKeyName: "grades_records_section_subject_fk"
            columns: ["section_subject_id", "school_year_id", "section_id"]
            isOneToOne: false
            referencedRelation: "section_subjects"
            referencedColumns: ["id", "school_year_id", "section_id"]
          },
          {
            foreignKeyName: "section_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      register_school: {
        Args: {
          email: string
          full_name: string
          school_name: string
          slug: string
        }
        Returns: Json
      }
    }
    Enums: {
      attendance_status: "present" | "absent" | "late" | "excused"
      enrollment_status: "active" | "transferred" | "withdrawn" | "completed"
      grade_record_status: "draft" | "published" | "voided"
      record_status: "active" | "inactive" | "archived"
      report_status: "pending" | "generated" | "failed" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      attendance_status: ["present", "absent", "late", "excused"],
      enrollment_status: ["active", "transferred", "withdrawn", "completed"],
      grade_record_status: ["draft", "published", "voided"],
      record_status: ["active", "inactive", "archived"],
      report_status: ["pending", "generated", "failed", "archived"],
    },
  },
} as const
