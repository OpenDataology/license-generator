/*
env.d.ts

Copyright (c) 2022 The OpenDataology Authors 
All rights reserved.

SPDX-License-Identifier: Apache-2.0
*/



/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
