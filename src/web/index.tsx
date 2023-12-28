import * as React from "react";
import { render } from "react-dom";
import p from "./1.png";

// client.ts
import { edenTreaty } from "@elysiajs/eden";
import type { Server } from "../index";

const client = edenTreaty<Server>("http://localhost:3000");

const App: React.FC = () => {
  // response type: 'Hi Elysia'
  client.user.get().then((response) => {
    console.info(response.data?.elysia);
  });

  return (
    <>
      <div>1</div>
      <img alt="text" src={p} />
    </>
  );
};

render(<App />, document.body);
