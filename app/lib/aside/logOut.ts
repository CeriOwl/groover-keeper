import { redirect } from "next/navigation";
import { deleteSession } from "../session";

export default function logOut() {
  deleteSession()
  redirect("/")
}
