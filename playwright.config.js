"use strict";

const {defineConfig,devices}=require("@playwright/test");

module.exports=defineConfig({
  testDir:"./tests/e2e",timeout:120000,expect:{timeout:10000},workers:1,retries:0,
  reporter:[["list"]],
  use:{...devices["Desktop Chrome"],baseURL:"http://127.0.0.1:4173",viewport:{width:1366,height:768},trace:"retain-on-failure",screenshot:"only-on-failure"},
  webServer:{command:"node tests/static-server.js",url:"http://127.0.0.1:4173",reuseExistingServer:true,timeout:30000}
});
