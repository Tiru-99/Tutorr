import prisma from '@tutorr/db';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  console.log("The id in the backend is", id);

  if (!id) {
    return NextResponse.json(
      { message: "No id found" },
      { status: 400 }
    );
  }

  try {
    const teacher = await prisma.teacher.findFirst({
      where: {
        user: {
          id: id,
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(teacher, { status: 200 });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
