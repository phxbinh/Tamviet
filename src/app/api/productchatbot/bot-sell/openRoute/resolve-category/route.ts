// src/app/api/resolve-category/route.ts

/*
import { NextRequest, NextResponse } from 'next/server';
import { sqlApp as sql } from '@/lib/neon/sql';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name');

  if (!name) {
    return NextResponse.json(
      { error: 'Missing name' },
      { status: 400 }
    );
  }

  const rows = await sql`
    SELECT id, name, slug
    FROM categories
    WHERE is_active = true
      AND (
        LOWER(name) LIKE LOWER(${`%${name}%`})
        OR LOWER(slug) LIKE LOWER(${`%${name}%`})
      )
    ORDER BY display_order ASC
    LIMIT 1
  `;

  const category = rows[0];

  if (!category) {
    return NextResponse.json(
      { error: 'Category not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
}
*/

// src/app/api/productchatbot/bot-sell/openRoute/resolve-category/route.ts

/*
import { NextRequest, NextResponse } from 'next/server';

import { sqlApp as sql } from '@/lib/neon/sql';

export async function GET(req: NextRequest) {

  const name =
    req.nextUrl.searchParams.get('name');

  if (!name) {
    return NextResponse.json(
      {
        error: 'Missing category name',
      },
      {
        status: 400,
      }
    );
  }

  try {

    const rows = await sql`
      SELECT
        id,
        name,
        slug
      FROM categories
      WHERE is_active = true
      AND (
        LOWER(name) LIKE LOWER(${`%${name}%`})
        OR LOWER(slug) LIKE LOWER(${`%${name}%`})
      )
      ORDER BY display_order ASC
      LIMIT 1
    `;

    const category = rows[0];

    if (!category) {
      return NextResponse.json(
        {
          error: 'Category not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(category);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}
*/


// src/app/api/productchatbot/bot-sell/openRoute/resolve-category/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { sqlApp as sql } from '@/lib/neon/sql';

export async function GET(req: NextRequest) {

  const name =
    req.nextUrl.searchParams.get('name');

  if (!name) {
    return NextResponse.json(
      {
        error: 'Missing category name',
      },
      {
        status: 400,
      }
    );
  }

  try {

    const rows = await sql`
      SELECT
        c.id,
        c.name,
        c.slug,
        pt.code
      FROM categories c

      LEFT JOIN product_types pt
        ON LOWER(pt.name) = LOWER(c.name)

      WHERE c.is_active = true
      AND (
        LOWER(c.name) LIKE LOWER(${`%${name}%`})
        OR LOWER(c.slug) LIKE LOWER(${`%${name}%`})
        OR LOWER(pt.code) LIKE LOWER(${`%${name}%`})
      )

      ORDER BY c.display_order ASC

      LIMIT 1
    `;

    const category = rows[0];

    if (!category) {
      return NextResponse.json(
        {
          error: 'Category not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(category);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}





