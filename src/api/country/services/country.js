"use strict";
const handleError = require("../../../utils/utils").handleError;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::country.country", ({ strapi }) => ({
  async handleOneToManyRelation(countries, parent) {
    const countriesStrapiIds = [];

    try {
      if (countries && countries.length) {
        for (const country of countries) {
          country.medusa_id = country.id.toString();
          delete country.id;

          if (parent === "region") {
            delete country.region_id;
          }

          const found = await strapi.services["api::country.country"].findOne({
            medusa_id: country.medusa_id,
          });
          if (found) {
            countriesStrapiIds.push({ id: found.id });
            continue;
          }

          const create = await strapi.entityService.create(
            "api::country.country",
            { data: country }
          );
          countriesStrapiIds.push({ id: create.id });
        }
      }
      return countriesStrapiIds;
    } catch (e) {
      handleError(strapi, e);
      throw new Error("Delegated creation failed");
    }
  },
  async findOne(params = {}) {
    const fields = ["id"];
    const filters = {
      ...params,
    };
    return (
      await strapi.entityService.findMany("api::country.country", {
        fields,
        filters,
      })
    )[0];
  },
}));
