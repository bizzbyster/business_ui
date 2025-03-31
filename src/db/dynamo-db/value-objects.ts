export class Organization {
  #orgPrefix = "ORG";
  #metadataPrefix = "METADATA";
  #pkAndSkSeparator = "#";
  #type = "ORGANIZATION";
  orgItem: OrganizationData | undefined = undefined;

  #isValid = (input: NewOrganizationInputData) => {
    try {
      const { PK, SK, name, orgId, type } = input;
      const [orgPrefix, idOnPK] = PK.split(this.#pkAndSkSeparator);
      if (orgPrefix !== this.#orgPrefix || !`${idOnPK}`.length) return false;
      const [metadataPrefix, idOnSK] = SK.split(this.#pkAndSkSeparator);
      if (metadataPrefix !== this.#metadataPrefix || !`${idOnSK}`.length)
        return false;
      if (!name) return false;
      if (!orgId) return false;
      if (type !== this.#type) return false;
      return true;
    } catch (e) {
      return false;
    }
  };
  constructor(input: NewOrganizationInputData) {
    if (this.#isValid(input)) {
      const now = new Date().toISOString();
      this.orgItem = {
        PK: input.PK,
        SK: input.SK,
        type: input.type,
        orgId: input.orgId,
        name: input.name,
        createdAt: now,
        updatedAt: now,
      };
    }
  }
}

export class Application {
  #orgPrefix = "ORG";
  #metadataPrefix = "APP";
  #pkAndSkSeparator = "#";
  #type = "APP";
  appItem: AppData | undefined = undefined;

  #isValid = (input: NewAppInputData) => {
    try {
      const { PK, SK, apiKey, appId, domain, orgId, type } = input;
      const [orgPrefix, idOnPK] = PK.split(this.#pkAndSkSeparator);
      if (orgPrefix !== this.#orgPrefix || !`${idOnPK}`.length) return false;
      const [metadataPrefix, idOnSK] = SK.split(this.#pkAndSkSeparator);
      if (metadataPrefix !== this.#metadataPrefix || !`${idOnSK}`.length)
        return false;
      if (!apiKey) return false;
      if (!appId) return false;
      if (!domain) return false;
      if (!orgId) return false;
      if (type !== this.#type) return false;
      return true;
    } catch (e) {
      return false;
    }
  };
  constructor(private readonly input: NewAppInputData) {
    if (this.#isValid(input)) {
      const now = new Date().toISOString();
      this.appItem = {
        PK: input.PK,
        SK: input.SK,
        type: input.type,
        appId: input.appId,
        orgId: input.orgId,
        apiKey: input.apiKey,
        domain: input.domain,
        createdAt: now,
        updatedAt: now,
      };
    }
  }
}

interface NewOrganizationInputData {
  PK: `ORG#${string}`; // Groups all items for this org
  SK: `METADATA#${string}`; // Identifies this as org metadata
  type: "ORGANIZATION";
  orgId: string;
  name: string;
}

interface OrganizationData extends NewOrganizationInputData {
  createdAt: string; // "2024-01-24T00:00:00Z",
  updatedAt: string; // "2024-01-24T00:00:00Z",
}

interface NewAppInputData {
  PK: `ORG#${string}`; // Same PK as org for grouping
  SK: `APP#${string}`; // Identifies this as an app
  type: "APP";
  appId: string;
  orgId: string;
  apiKey: string;
  domain: string;
}

interface AppData extends NewAppInputData {
  createdAt: string; // "2024-01-24T00:00:00Z";
  updatedAt: string; // "2024-01-24T00:00:00Z";
}
