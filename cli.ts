import { Command } from "commander";
import mongoose from "mongoose";
import readline from "readline";
import connectToDB from "./src/config/dbConnection";
import dotenv from "dotenv";
import SubscriptionStatus from "./src/interfaces/schemaTypes/enums/SubscriptionStatus";
import subscriptionService from "./src/services/subscription.service";
import defaultSubscriptions from "./src/utils/defaultSubscriptions";

dotenv.config();

const program = new Command();

const handleError = (error: any) => {
    console.error("An error occurred:", error.message || error);
};

const parseStatus = (status: string) => {
    const parsedStatus =
        SubscriptionStatus[status as keyof typeof SubscriptionStatus];
    if (!parsedStatus) {
        throw new Error(
            `Invalid status. Available statuses are: ${Object.values(
                SubscriptionStatus
            ).join(", ")}`
        );
    }
    return parsedStatus;
};

program
    .command("add-subscription")
    .description("Add a new subscription")
    .requiredOption("--name <name>", "Subscription name")
    .requiredOption("--cost <cost>", "Subscription cost")
    .requiredOption("--searchCount <searchCount>", "Number of searches")
    .requiredOption("--status <status>", "Subscription status")
    .action(async (options) => {
        try {
            const { name, cost, searchCount, status } = options;
            const parsedCost = parseFloat(cost);
            const parsedSearchCount = parseInt(searchCount, 10);
            const parsedStatus = parseStatus(status);

            if (isNaN(parsedCost) || parsedCost <= 0) {
                throw new Error(
                    "Invalid cost. Please enter a positive number."
                );
            }
            if (isNaN(parsedSearchCount) || parsedSearchCount < 0) {
                throw new Error(
                    "Invalid search count. Please enter a non-negative integer."
                );
            }

            console.log("Adding subscription with the following details:");
            console.log(`Name: ${name}`);
            console.log(`Cost: ${parsedCost}`);
            console.log(`Search Count: ${parsedSearchCount}`);
            console.log(`Status: ${parsedStatus}`);

            const newSubscription =
                await subscriptionService.insertSubscription(
                    name,
                    parsedCost,
                    parsedSearchCount,
                    parsedStatus
                );
            console.log("Added subscription:", newSubscription);
        } catch (error) {
            handleError(error);
        }
    });

program
    .command("update-subscription <id>")
    .description("Update subscription details")
    .option("--name <name>", "Update subscription name")
    .option("--cost <cost>", "Update subscription cost", parseFloat)
    .option(
        "--searchCount <count>",
        "Update subscription search count",
        parseInt
    )
    .option("--status <status>", "Update subscription status")
    .action(async (id, options) => {
        try {
            const updates: Record<string, any> = {};
            if (options.name) updates.name = options.name;
            if (options.cost) updates.cost = options.cost;
            if (options.searchCount) updates.searchCount = options.searchCount;
            if (options.status) updates.status = parseStatus(options.status);

            const updatedSubscription =
                await subscriptionService.updateSubscription(id, updates);
            if (updatedSubscription) {
                console.log("Updated subscription:", updatedSubscription);
            } else {
                console.log("Subscription not found.");
            }
        } catch (error) {
            handleError(error);
        }
    });

program
    .command("get-subscription <id>")
    .description("Get subscription by Id")
    .action(async (id) => {
        try {
            const subscription = await subscriptionService.getSubscriptionById(
                id
            );
            if (subscription) {
                console.log("Subscription details:");
                console.log(`ID: ${subscription.subscriptionId}`);
                console.log(`Name: ${subscription.name}`);
                console.log(`Cost: ${subscription.cost}`);
                console.log(`Search Count: ${subscription.searchCount}`);
                console.log(`Status: ${subscription.status}`);
            } else {
                console.log("Subscription not found.");
            }
        } catch (error) {
            handleError(error);
        }
    });

program
    .command("delete-subscription <id>")
    .description("Remove a subscription by Id")
    .action(async (id) => {
        try {
            await subscriptionService.deleteSubscription(id);
            console.log(`Subscription with ID ${id} has been deleted.`);
        } catch (error) {
            handleError(error);
        }
    });

program
    .command("get-all-subscription")
    .description("Get all subscriptions")
    .action(async () => {
        try {
            const subscriptions =
                await subscriptionService.getAllSubscriptions();
            console.log("All subscriptions:");
            subscriptions.forEach((sub) => {
                console.log(
                    `ID: ${sub.subscriptionId}, Name: ${sub.name}, Cost: ${sub.cost}, Search Count: ${sub.searchCount}, Status: ${sub.status}`
                );
            });
        } catch (error) {
            handleError(error);
        }
    });

program
    .command("mark-all-status <status>")
    .description("Mark all subscriptions with the specified status")
    .action(async (status) => {
        try {
            const parsedStatus = parseStatus(status);
            await subscriptionService.updateAllSubscriptionsStatus(
                parsedStatus
            );
            console.log(
                `All subscriptions have been marked as ${parsedStatus}.`
            );
        } catch (error) {
            handleError(error);
        }
    });

program
    .command("delete-all-subscriptions")
    .description("Remove all subscriptions")
    .action(async () => {
        try {
            await subscriptionService.deleteAllSubscriptions();
            console.log("All subscriptions have been deleted.");
        } catch (error) {
            handleError(error);
        }
    });

program
    .command("seed-subscription")
    .description("Insert default packages into the database")
    .action(async () => {
        try {
            await subscriptionService.bulkInsertSubscriptions(
                defaultSubscriptions
            );
            console.log("Default packages have been inserted.");
        } catch (error) {
            handleError(error);
        }
    });

async function startCLI() {
    try {
        console.log("FindMyMeds CLI Connecting to database...");
        await connectToDB();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const displayCommands = () => {
            console.log("\nAvailable commands:");
            program.commands.forEach((cmd: any) => {
                const commandName = cmd.name();
                const args =
                    cmd._args.map((arg: any) => `<${arg.name()}>`).join(" ") ||
                    "";
                console.log(`- ${commandName} ${args}`);
            });
        };

        const main = async () => {
            while (true) {
                const answer = await new Promise<string>((resolve) => {
                    rl.question(
                        "\nEnter a command (or press q to quit): ",
                        resolve
                    );
                });

                if (answer.trim() === "q") {
                    console.log("Exiting...");
                    rl.close();
                    mongoose.connection.close();
                    break;
                }

                try {
                    await program.parseAsync(answer.trim().split(" "), {
                        from: "user",
                    });
                } catch (error) {
                    handleError(error);
                }
            }
        };

        displayCommands();
        await main();
    } catch (error) {
        console.error("Failed to connect to the database:", error || error);
        process.exit(1);
    }
}

startCLI();
