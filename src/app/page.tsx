"use client";

import { User, users } from "@/consts/users";
import { Select } from "@/ui/select";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<User | null>(null);
  const [multiValue, setMultiValue] = useState<User[]>([]);
  console.log(multiValue);

  return (
    <div className="p-4">
      <Select
        isMulti
        className="px-2"
        options={users}
        value={multiValue}
        onChange={(v) => setMultiValue(v)}
        renderOption={RenderItem}
        renderSelected={"name"}
        searchBy={["name", "email", "region"]}
        listType="popover"
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

const RenderSelectedItem = ({ name, email }: User) => {
  return (
    <div className="rounded-md border px-2 py-0.5 text-xs bg-background grow">
      {name}, <span className="text-muted-foreground">{email}</span>
    </div>
  );
};
