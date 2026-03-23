export const queryKeys = {
  contacts: ["chat", "contacts"] as const,
  requests: ["chat", "requests"] as const,
  publicConversations: ["chat", "public-conversations"] as const,
  profile: ["user", "profile"] as const,
  conversation: (conversationId: string) =>
    ["chat", "conversation", conversationId] as const,
  contactProfile: (conversationId: string) =>
    ["chat", "contact-profile", conversationId] as const,
  contactCandidates: (searchtext: string) =>
    ["chat", "contact-candidates", searchtext.trim().toLowerCase()] as const,
};
