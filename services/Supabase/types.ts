export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      CreditScores: {
        Row: {
          error: string | null
          id: string
          insertedAt: string
          profileId: string
          score: number | null
          updatedAt: string
        }
        Insert: {
          error?: string | null
          id?: string
          insertedAt?: string
          profileId: string
          score?: number | null
          updatedAt?: string
        }
        Update: {
          error?: string | null
          id?: string
          insertedAt?: string
          profileId?: string
          score?: number | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "CreditScores_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Events: {
        Row: {
          env: string
          id: string
          insertedAt: string
          meta: Json | null
          name: string
        }
        Insert: {
          env: string
          id?: string
          insertedAt?: string
          meta?: Json | null
          name: string
        }
        Update: {
          env?: string
          id?: string
          insertedAt?: string
          meta?: Json | null
          name?: string
        }
        Relationships: []
      }
      Profiles: {
        Row: {
          addressLine1: string | null
          dateOfBirthDay: number | null
          dateOfBirthMonth: number | null
          dateOfBirthYear: number | null
          email: string
          employmentType: Database["public"]["Enums"]["employmentType"] | null
          firstName: string | null
          id: string
          insertedAt: string
          isTest: boolean | null
          lastName: string | null
          livingSituation: Database["public"]["Enums"]["livingSituation"] | null
          mobilePhone: string
          postCode: string | null
          residency: Database["public"]["Enums"]["residency"] | null
          state: string | null
          suburb: string | null
          updatedAt: string
        }
        Insert: {
          addressLine1?: string | null
          dateOfBirthDay?: number | null
          dateOfBirthMonth?: number | null
          dateOfBirthYear?: number | null
          email: string
          employmentType?: Database["public"]["Enums"]["employmentType"] | null
          firstName?: string | null
          id?: string
          insertedAt?: string
          isTest?: boolean | null
          lastName?: string | null
          livingSituation?:
            | Database["public"]["Enums"]["livingSituation"]
            | null
          mobilePhone: string
          postCode?: string | null
          residency?: Database["public"]["Enums"]["residency"] | null
          state?: string | null
          suburb?: string | null
          updatedAt?: string
        }
        Update: {
          addressLine1?: string | null
          dateOfBirthDay?: number | null
          dateOfBirthMonth?: number | null
          dateOfBirthYear?: number | null
          email?: string
          employmentType?: Database["public"]["Enums"]["employmentType"] | null
          firstName?: string | null
          id?: string
          insertedAt?: string
          isTest?: boolean | null
          lastName?: string | null
          livingSituation?:
            | Database["public"]["Enums"]["livingSituation"]
            | null
          mobilePhone?: string
          postCode?: string | null
          residency?: Database["public"]["Enums"]["residency"] | null
          state?: string | null
          suburb?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      Referrals: {
        Row: {
          email: string
          id: string
          insertedAt: string
          meta: Json | null
          partnerName: Database["public"]["Enums"]["referralPartnerName"]
        }
        Insert: {
          email: string
          id?: string
          insertedAt?: string
          meta?: Json | null
          partnerName: Database["public"]["Enums"]["referralPartnerName"]
        }
        Update: {
          email?: string
          id?: string
          insertedAt?: string
          meta?: Json | null
          partnerName?: Database["public"]["Enums"]["referralPartnerName"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uuid7: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      employmentType:
        | "fullTime"
        | "partTime"
        | "selfEmployed"
        | "casual"
        | "unemployed"
        | "pension"
        | "contractor"
      livingSituation:
        | "renting"
        | "ownerWithMortgage"
        | "ownerWithoutMortgage"
        | "livingWithParents"
        | "board"
      referralPartnerName: "cra" | "mab"
      residency: "citizen" | "pr" | "visa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
