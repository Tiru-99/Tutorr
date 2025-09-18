"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useGetWallet } from "@/hooks/teacherProfileHooks"
import { WalletSkeleton } from "@/components/Loaders/WalletSkeleton"
import { Inbox } from "lucide-react"
import PayoutDialog from "@/components/TeacherComponents/Payout"

// Transaction Types
enum TransactionType {
    BOOKING = "BOOKING",
    REFUND = "REFUND",
    PAYOUT = "PAYOUT",
    WITHDRAWAL = "WITHDRAWAL",
}


// Currency Formatter
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default function WalletPage() {
    const [page, setPage] = useState<Record<TransactionType, number>>({
        BOOKING: 1,
        REFUND: 1,
        PAYOUT: 1,
        WITHDRAWAL: 1,
    })
    const pageSize = 7

    const { data, isLoading, error } = useGetWallet()

    if (isLoading) return <WalletSkeleton />
    if (error || !data) return <div className="p-6 text-red-500">Error fetching wallet</div>

    const { pendingAmount, amount, transactions } = data

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
            {/* Tidy Header */}
            <div className="flex justify-between">
                <header className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">Wallet</h1>
                    <p className="text-sm text-muted-foreground">Track your balance, pending amounts, and recent transactions.</p>
                </header>

                <PayoutDialog/>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className="text-3xl font-semibold tracking-tight tabular-nums">{currency.format(amount ?? 0)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Lifetime Earnings</p>
                        <p className="text-3xl font-semibold tracking-tight tabular-nums">{currency.format(0)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Pending Call Completion</p>
                        <p className="text-3xl font-semibold tracking-tight tabular-nums">
                            {currency.format(pendingAmount._sum.amount ?? 0)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">In Withdrawal</p>
                        <p className="text-3xl font-semibold tracking-tight tabular-nums">{currency.format(0)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Tabs */}
            <Tabs defaultValue="BOOKING" className="w-full">
                <TabsList className="mb-4 w-full justify-start gap-2 bg-muted p-1 rounded-lg">
                    {Object.values(TransactionType).map((type) => (
                        <TabsTrigger
                            key={type}
                            value={type}
                            className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            <span className="capitalize">{type.toLowerCase()}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.values(TransactionType).map((type) => {
                    const filteredTransactions = transactions.filter((t: any) => t.type === type)
                    const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1
                    const currentPage = page[type]
                    const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

                    return (
                        <TabsContent key={type} value={type}>
                            {filteredTransactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                                    <Inbox className="h-12 w-12" />
                                    <p className="text-sm">No {type.toLowerCase()} transactions found</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto rounded-lg border border-border bg-card">
                                        <table className="w-full border-collapse text-sm">
                                            <thead className="bg-muted/50 text-left text-muted-foreground">
                                                <tr>
                                                    <th className="px-4 py-2 font-medium">Date</th>
                                                    <th className="px-4 py-2 font-medium">Customer</th>
                                                    <th className="px-4 py-2 font-medium">Amount</th>
                                                    <th className="px-4 py-2 font-medium">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedTransactions.map((tx: any) => (
                                                    <tr key={tx.id} className="border-t hover:bg-muted/30 transition-colors">
                                                        <td className="px-4 py-2">
                                                            <span className="tabular-nums">{new Date(tx.createdAt).toLocaleDateString()}</span>
                                                        </td>
                                                        <td className="px-4 py-2">{tx.student?.name ?? "-"}</td>
                                                        <td className="px-4 py-2 font-medium">{currency.format(tx.amount)}</td>
                                                        <td className="px-4 py-2 text-muted-foreground">
                                                            {tx.booking?.cancellationReason ?? "-"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {filteredTransactions.length > pageSize && (
                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => setPage((prev) => ({ ...prev, [type]: prev[type] - 1 }))}
                                            >
                                                Prev
                                            </Button>
                                            <span className="px-2 py-1 text-sm text-muted-foreground">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setPage((prev) => ({ ...prev, [type]: prev[type] + 1 }))}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </TabsContent>
                    )
                })}
            </Tabs>
        </div>
    )
}
