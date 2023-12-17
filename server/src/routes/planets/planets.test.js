const request = require("supertest");
const app = require("../../app");
const mongoConnect = require("../../services/mongo");

describe("planet API", () => {
  beforeAll(async () => {
    await mongoConnect.mongoConnect();
  });

  describe("Test GET /planets", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/planets")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });
});
