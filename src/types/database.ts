export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          completed: boolean;
          status: 'active' | 'completed' | 'expired';
          notification_sent_at: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      task_history: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          completed_at: string | null;
          expired_at: string | null;
          status: 'completed' | 'expired';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['task_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['task_history']['Insert']>;
      };
      user_profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          notification_preferences: {
            enabled: boolean;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
    };
  };
}