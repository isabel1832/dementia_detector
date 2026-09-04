// Hand-written to match supabase/schema.sql. If the schema changes, update
// this file to match (or regenerate with `npx supabase gen types typescript`).
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: "player" | "caregiver" | "professional";
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: "player" | "caregiver" | "professional";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      players: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string | null;
          access_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          first_name: string;
          last_name?: string | null;
          access_code: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["players"]["Insert"]>;
        Relationships: [];
      };
      caregiver_connections: {
        Row: {
          id: string;
          caregiver_id: string;
          player_id: string;
          relationship: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          caregiver_id: string;
          player_id: string;
          relationship?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["caregiver_connections"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "caregiver_connections_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
      game_sessions: {
        Row: {
          id: string;
          player_id: string;
          game_type: "MEMORY_MATCH" | "PICTURE_RECALL" | "SEQUENCE";
          difficulty: "easy" | "medium" | "hard";
          duration_seconds: number;
          score: number;
          accuracy: number;
          attempts: number;
          hints_used: number;
          errors: number;
          status: "COMPLETED" | "SKIPPED" | "EXITED_EARLY";
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          game_type: "MEMORY_MATCH" | "PICTURE_RECALL" | "SEQUENCE";
          difficulty: "easy" | "medium" | "hard";
          duration_seconds: number;
          score: number;
          accuracy: number;
          attempts: number;
          hints_used?: number;
          errors?: number;
          status: "COMPLETED" | "SKIPPED" | "EXITED_EARLY";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["game_sessions"]["Insert"]>;
        Relationships: [];
      };
      player_settings: {
        Row: {
          player_id: string;
          text_size: string;
          contrast: string;
          sound_effects: boolean;
          music: boolean;
          voice_instructions: boolean;
          repeat_instructions: boolean;
          voice_speed: string;
          reduced_motion: boolean;
        };
        Insert: {
          player_id: string;
          text_size?: string;
          contrast?: string;
          sound_effects?: boolean;
          music?: boolean;
          voice_instructions?: boolean;
          repeat_instructions?: boolean;
          voice_speed?: string;
          reduced_motion?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["player_settings"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
