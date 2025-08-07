-- CreateTable
CREATE TABLE "TemplateSlots" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "slotTime" TEXT NOT NULL,
    "status" "StatusType" NOT NULL,

    CONSTRAINT "TemplateSlots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateSlots" ADD CONSTRAINT "TemplateSlots_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
