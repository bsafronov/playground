"use client";

import { User, users } from "@/consts/users";
import { Select } from "@/ui/select";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<User | null>(null);
  console.log(value);
  console.log(users.length);

  return (
    <div className="p-4">
      <Select
        isMulti
        options={users}
        value={value}
        onChange={(v) => setValue(v)}
        renderOption={RenderItem}
        renderSelected={}
        searchBy={["name", "age", "email", "region"]}
      />
    </div>
  );
}

const RenderItem = ({ age, name, email, phone, region }: User) => {
  return (
    <div className="flex flex-col">
      <div>
        <span>{name}, </span>
        <span className="text-xs text-muted-foreground">{age}</span>
      </div>
      <p className="text-xs text-muted-foreground">{email}</p>
      <p className="text-xs text-muted-foreground">{region}</p>
      <p className="text-xs text-muted-foreground text-emerald-500">{phone}</p>
    </div>
  );
};
