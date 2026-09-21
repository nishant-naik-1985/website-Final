/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    try {
      app.findCollectionByNameOrId("enquiries");
      return;
    } catch (_) {
      // collection does not exist yet — create it below
    }

    const collection = new Collection({
      type: "base",
      name: "enquiries",
      // Public contact form: anyone may submit, only superusers can read/manage.
      listRule: null,
      viewRule: null,
      createRule: "",
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "name", type: "text", required: true, max: 200 },
        { name: "company", type: "text", required: true, max: 200 },
        { name: "email", type: "email", required: true },
        { name: "phone", type: "text", max: 40 },
        {
          name: "interest",
          type: "select",
          required: true,
          maxSelect: 1,
          values: [
            "cae-simulation",
            "cad-engineering",
            "pre-post-processing",
            "engineering-consulting",
            "digital-engineering-automation",
            "resource-augmentation",
            "other",
          ],
        },
        { name: "message", type: "text", required: true, max: 5000 },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
    });
    app.save(collection);
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("enquiries");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) {
        console.log("Collection not found, skipping revert");
        return;
      }
      throw e;
    }
  },
);
