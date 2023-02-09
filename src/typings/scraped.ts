type action = {
  date: string,
  id: number,
  type: "answer" | "question" | "comment",
  userId: number,
  user: string,
  reason: string,
  content: string,
  accepted: boolean
}
export type userActions = action[]