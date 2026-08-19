import { db } from "../lib/db/db";
import {
  roleTable,
  actionTable,
  mediaFormatTable,
  conditionTable,
  statusTable,
  staffTable,
  ownerTable,
  itemTable,
} from "./schema";
import { randomUUID } from "crypto";

const main = async () => {
  const roles = await db
    .insert(roleTable)
    .values([{ name: "Admin" }, { name: "Manager" }, { name: "Barista" }])
    .returning();

  const actions = await db
    .insert(actionTable)
    .values([
      { name: "Checked In" }, // customer dropped off their own record at the cafe
      { name: "Played for Customer" }, // staff put it on the turntable for someone
      { name: "Lent to Customer" }, // handed to a customer to hold/listen at their table
      { name: "Returned to Shelf" }, // came back from being played/lent, back in rotation
      { name: "Reclaimed by Owner" }, // the actual owner took their record back for good
      { name: "Condition Updated" }, // staff noted wear/damage
    ])
    .returning();

  const mediaFormats = await db
    .insert(mediaFormatTable)
    .values([
      { name: 'Vinyl LP (12")' },
      { name: 'Vinyl EP (7")' },
      { name: "CD" },
      { name: "Cassette" },
    ])
    .returning();

  const conditions = await db
    .insert(conditionTable)
    .values([
      { name: "Mint" },
      { name: "Near Mint" },
      { name: "Very Good Plus" },
      { name: "Very Good" },
      { name: "Good" },
      { name: "Fair" },
    ])
    .returning();

  const statuses = await db
    .insert(statusTable)
    .values([
      { name: "In Collection" }, // sitting on the shelf, available
      { name: "Currently Playing" }, // on the turntable right now
      { name: "On Loan to Customer" }, // handed to a customer at their table
      { name: "Reclaimed by Owner" }, // customer took their record home
      { name: "In Repair" },
    ])
    .returning();

  console.log("Seeding staff...");

  // ---------------------------------------------------------------------
  // 2. staff (depends on role)
  // ---------------------------------------------------------------------
  const staffMembers = await db
    .insert(staffTable)
    .values([
      {
        username: "jdoe",
        password: "hashed_password_1", // replace with a real hash in practice
        roleId: roles.find((r) => r.name === "Admin")!.id,
        createdAt: new Date(),
        idPublic: randomUUID(),
      },
      {
        username: "asmith",
        password: "hashed_password_2",
        roleId: roles.find((r) => r.name === "Manager")!.id,
        idPublic: randomUUID(),
      },
      {
        username: "bwilliams",
        password: "hashed_password_3",
        roleId: roles.find((r) => r.name === "Barista")!.id,
        idPublic: randomUUID(),
      },
    ])
    .returning();

  console.log(
    "Seeding record owners (customers who dropped off their own vinyl/CDs)...",
  );

  // ---------------------------------------------------------------------
  // 3. owner (depends on status, condition)
  //    NOTE: these are customers who left THEIR OWN records at the cafe,
  //    not the cafe's in-house collection.
  // ---------------------------------------------------------------------
  const owners = await db
    .insert(ownerTable)
    .values([
      {
        name: "John Carter",
        contact: "john.carter@email.com",
        date:"2024-01-15", // date dropped off
        statusId: statuses.find((s) => s.name === "In Collection")!.id,
        conditionId: conditions.find((c) => c.name === "Near Mint")!.id,
        location: "Shelf A1",
        staffNotes:
          "Regular customer, drops off his jazz collection on weekends.",
      },
      {
        name: "Maria Lopez",
        contact: "maria.lopez@email.com",
        date: "2024-02-03",
        statusId: statuses.find((s) => s.name === "On Loan to Customer")!.id,
        conditionId: conditions.find((c) => c.name === "Very Good")!.id,
        location: "Table 4",
        staffNotes: "",
      },
      {
        name: "Kevin Nguyen",
        contact: "kevin.n@email.com",
        date: "2024-03-20",
        statusId: statuses.find((s) => s.name === "Reclaimed by Owner")!.id,
        conditionId: conditions.find((c) => c.name === "Mint")!.id,
        location: "N/A - picked up",
        staffNotes: "Came back for it after two weeks, all good.",
      },
      {
        name: "Downtown Vinyl Club",
        contact: "contact@downtownvinylclub.com",
        date: "2024-04-10",
        statusId: statuses.find((s) => s.name === "In Repair")!.id,
        conditionId: conditions.find((c) => c.name === "Fair")!.id,
        location: "Repair bench",
        staffNotes: "Sleeve is torn, owner aware and okay with the delay.",
      },
    ])
    .returning();

  console.log("Seeding items (some cafe-owned, some customer-owned)...");

  // ---------------------------------------------------------------------
  // 4. item (depends on owner [nullable], mediaFormat)
  // ---------------------------------------------------------------------


  console.log("Seeding item activity log...");

};

main();
