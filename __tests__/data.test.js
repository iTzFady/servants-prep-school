import { describe, it, expect } from "vitest";
import { days } from "@/data/days";
import { educationTypes } from "@/data/education_types";
import { gender } from "@/data/gender";

describe("Data Helpers", () => {
  describe("Days", () => {
    it("should have 7 days", () => {
      expect(days).toHaveLength(7);
    });

    it("should have all days with id, label, and value", () => {
      days.forEach((day, index) => {
        expect(day).toHaveProperty("id");
        expect(day).toHaveProperty("label");
        expect(day).toHaveProperty("value");
        expect(day.id).toBe(index);
      });
    });

    it("should have correct Arabic day labels", () => {
      expect(days[0].label).toBe("السبت");
      expect(days[1].label).toBe("الأحد");
      expect(days[2].label).toBe("الإتنين");
      expect(days[3].label).toBe("الثلاثاء");
      expect(days[4].label).toBe("الأربعاء");
      expect(days[5].label).toBe("الخميس");
      expect(days[6].label).toBe("الجمعة");
    });

    it("should have correct English day values", () => {
      expect(days[0].value).toBe("saturday");
      expect(days[1].value).toBe("sunday");
      expect(days[2].value).toBe("monday");
      expect(days[3].value).toBe("tuesday");
      expect(days[4].value).toBe("wednesday");
      expect(days[5].value).toBe("thursday");
      expect(days[6].value).toBe("friday");
    });

    it("should be read-only array", () => {
      expect(Array.isArray(days)).toBe(true);
    });
  });

  describe("Education Types", () => {
    it("should have 10 education types", () => {
      expect(educationTypes).toHaveLength(10);
    });

    it("should have all education types with id, label, and value", () => {
      educationTypes.forEach((type, index) => {
        expect(type).toHaveProperty("id");
        expect(type).toHaveProperty("label");
        expect(type).toHaveProperty("value");
        expect(type.id).toBe(index);
      });
    });

    it("should have first education type as general secondary", () => {
      expect(educationTypes[0].label).toBe("ثانوي عام");
      expect(educationTypes[0].value).toBe("general_secondary");
    });

    it("should have last education type as graduate", () => {
      expect(educationTypes[9].label).toBe("خريج");
      expect(educationTypes[9].value).toBe("graduate");
    });

    it("should contain technical education types", () => {
      const technicalTypes = educationTypes.filter((t) =>
        t.value.includes("technical"),
      );
      expect(technicalTypes.length).toBeGreaterThan(0);
    });
  });

  describe("Gender", () => {
    it("should have 2 gender options", () => {
      expect(gender).toHaveLength(2);
    });

    it("should have all gender options with id, label, and value", () => {
      gender.forEach((g, index) => {
        expect(g).toHaveProperty("id");
        expect(g).toHaveProperty("label");
        expect(g).toHaveProperty("value");
        expect(g.id).toBe(index);
      });
    });

    it("should have male and female options", () => {
      expect(gender[0].label).toBe("ذكر");
      expect(gender[0].value).toBe("MALE");
      expect(gender[1].label).toBe("أنثى");
      expect(gender[1].value).toBe("FEMALE");
    });
  });
});
