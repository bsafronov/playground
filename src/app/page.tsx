"use client";

import { User, users } from "@/consts/users";
import { Select } from "@/ui/select";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<User | null>(null);
  const [multiValue, setMultiValue] = useState<User[]>([]);

  return (
    <div className="p-4">
      <Select
        isMulti
        options={users}
        value={multiValue}
        onChange={(v) => setMultiValue(v)}
        renderOption={"name"}
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

const RenderSelectedItem = (user: User, handleDelete: Function) => {
  return (
    <div
      className="overflow-hidden relative rounded-md border px-2 py-0.5 text-xs bg-background grow group"
      onClick={(e) => handleDelete}
    >
      {user.name}, <span className="text-muted-foreground">{user.email}</span>
      <div className="inset-0 flex items-center justify-center absolute group-hover:opacity-90 opacity-0 transition-opacity bg-red-500">
        <Trash2 className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};
