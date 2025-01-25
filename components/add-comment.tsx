"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";

export function AddComment() {
  const [comment, setComment] = useState("");
  //TODO: add fuction here
  function onSubmit() {}
  return (
    <Card className="m-1 p-1 shadow-lg dark:shadow-sm bg-secondary">
      <div className="flex flex-row items-center space-x-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback delayMs={500}>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-row grow justify-between">
          <Input
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a comment..."
          />
          <Button variant="ghost" size="icon" onClick={onSubmit}>
            <SendHorizonal />
          </Button>
        </div>
      </div>
    </Card>
  );
}
