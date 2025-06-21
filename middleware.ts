import { NextRequest, NextResponse } from "next/server";
import Cookies from "js-cookie";
import { compareArea, hashArea } from "./lib/utils";

export async function middleware(req: NextRequest) {
  
  let token = req.cookies.get('user-auth')
  const verifiedToken = token! && !!token.value.length

  if (req.nextUrl.pathname == '/' && !verifiedToken) {
    req.cookies.delete('user-auth')
    req.cookies.delete('user-area')
    return
  }

  if(!verifiedToken) {
    req.cookies.delete('user-auth')
    req.cookies.delete('user-area')
    return NextResponse.rewrite(new URL('/', req.url))
  }

  
  if(req.nextUrl.pathname.includes('/download')) {
    return
  }

  const area = req.cookies.get('user-area')

  if(area?.value && !!area.value.length) {
    const decryptedArea = compareArea(area.value)

    if (req.nextUrl.pathname == '/') {
      return NextResponse.rewrite(new URL(`/${decryptedArea}/usuarios`, req.url))
    }

    if(req.nextUrl.pathname.includes(decryptedArea)) {
      return
    } else {
      Cookies.remove('user-auth')
      Cookies.remove('user-area')
      return NextResponse.rewrite(new URL('/', req.url))
    }
  } else {
    req.cookies.delete('user-auth')
    return NextResponse.rewrite(new URL('/', req.url))
  }

}

export const config = {
  matcher: [
    '/',
    '/backoffice/:path*',
    '/backoffice/:path*/:path*'
  ]
}