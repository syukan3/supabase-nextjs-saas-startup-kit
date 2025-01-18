import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
    // Dummy data for the dashboard
    const stats = [
        { title: "Total Revenue", value: "$45,231.89", description: "20% increase from last month" },
        { title: "Subscriptions", value: "2,350", description: "10% increase from last month" },
        { title: "Active Users", value: "1,200", description: "5% increase from last week" },
        { title: "Conversion Rate", value: "3.5%", description: "1.5% increase from last quarter" }
    ]

    const recentActivity = [
        { user: "John Doe", action: "Created a new project", time: "2 hours ago" },
        { user: "Jane Smith", action: "Updated their profile", time: "4 hours ago" },
        { user: "Bob Johnson", action: "Completed a task", time: "6 hours ago" },
        { user: "Alice Brown", action: "Submitted a report", time: "1 day ago" },
        { user: "Charlie Wilson", action: "Joined a new team", time: "2 days ago" }
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your team's latest actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <li key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{activity.user}</p>
                                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                                </div>
                                <span className="text-sm text-muted-foreground">{activity.time}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Projects Overview</CardTitle>
                    <CardDescription>Status of your ongoing projects</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Project {index + 1}</p>
                                    <p className="text-sm text-muted-foreground">In progress - 75% complete</p>
                                </div>
                                <Button variant="outline">View Details</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
