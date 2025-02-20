import { dynamo } from "./config";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";

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
