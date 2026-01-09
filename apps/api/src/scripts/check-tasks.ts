import { db } from '../config/db';
import { tasks } from '../db/schema';
import { desc } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function checkTasks() {
    console.log('Checking recent tasks...');
    const recentTasks = await db.query.tasks.findMany({
        orderBy: [desc(tasks.createdAt)],
        limit: 10,
        with: {
            project: true,
        }
    });

    console.log(`Found ${recentTasks.length} recent tasks:`);
    recentTasks.forEach(t => {
        console.log(`- [${t.status}] "${t.title}" (Project: ${t.project?.name || t.projectId})`);
    });
    process.exit(0);
}

checkTasks();
