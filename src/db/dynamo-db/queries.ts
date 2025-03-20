import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "./config";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { Application, Organization } from "./value-objects";

export async function pingDynamoDB() {
  try {
    await dynamo.send(
      new DescribeTableCommand({
        TableName: process.env.AWS_DYNAMODB_TABLE,
      })
    );
    console.log("Table exists and is accessible");
    return true;
  } catch (error) {
    console.error("Could not access table:", error);
    return false;
  }
}

export async function createEntitiesForSyntheticTest(
  domain: string,
  email: string
) {
  try {
    const orgId = `TempOrg_${domain}_${email}`;
    const appId = `TempApp_${domain}_${email}`;

    const { orgItem } = new Organization({
      PK: `ORG#${orgId}`,
      SK: `METADATA#${orgId}`,
      type: "ORGANIZATION",
      orgId: orgId,
      name: "TempName",
    });

    const { appItem } = new Application({
      PK: `ORG#${orgId}`,
      SK: `APP#${appId}`,
      type: "APP",
      appId: appId,
      orgId: orgId,
      apiKey: "TempApiKey",
      domain: domain,
    });

    if (!orgItem || !appItem) {
      console.log("Invalid orgItem or appItem");
      return;
    }

    const res = await dynamo.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: process.env.AWS_DYNAMODB_TABLE,
              Item: orgItem,
            },
          },
          {
            Put: {
              TableName: process.env.AWS_DYNAMODB_TABLE,
              Item: appItem,
            },
          },
        ],
      })
    );

    console.dir(res, { depth: null });
    console.log(
      `Created organization: ${orgId} and app: ${appId} in a transaction`
    );
  } catch (error) {
    console.error("Error creating synthetic test entities:", error);
    throw error;
  }
}
