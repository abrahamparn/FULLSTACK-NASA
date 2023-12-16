const request = require("supertest");
const app = require("../../app");
const mongoConnect = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect.mongoConnect();
  });

  afterAll(async () => {
    await mongoConnect.mongoDisconnect();
  });
  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });

  describe("Test DELETE /launches", () => {
    test("it should response with 200", async () => {
      const respond = await request(app)
        .delete("/launches/100")
        .expect(200)
        .expect("Content-type", /json/);
    });
  });

  describe("Test POST /Launch", () => {
    const completeLaunchDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };
    const launcDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };
    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "Awikwok",
    };
    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchDate)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchDate.launchDate).valueOf;
      const responseDate = new Date(response.body.launchDate).valueOf;
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launcDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launcDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid date format",
      });
    });
  });
});
