import moment from "moment";
import fs from "fs";

const data = await fetch(
  `${process.env.VITE_BACKEND_BASE_URL}/record/dump`
).then((res) => res.json());

const transformedData = data.map(({ created_at, content, updated_at }) => {
  const createdAt = moment.utc(created_at).local().format("LLLL");
  const updatedAt = updated_at
    ? moment.utc(updated_at).local().format("LLLL")
    : null;

  const str = `${createdAt}\n${"-".repeat(
    createdAt.length
  )}\n${content}\n${"-".repeat(createdAt.length)}${
    updatedAt ? "\nUpdated at: " + updatedAt : ""
  }`;

  return str;
});

const text = transformedData.join("\n\n");

fs.writeFileSync("dump.txt", text);
