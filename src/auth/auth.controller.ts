import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { AuthGuard } from "@nestjs/passport";
import * as process from "node:process";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post("register")
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);

    this.authService.addRefreshToken(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    this.authService.addRefreshToken(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post("update")
  async updateTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies = req.cookies["refreshToken"];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshToken(res);
      throw new UnauthorizedException("Invalid refresh token");
    }

    const { refreshToken, ...response } = await this.authService.updateTokens(
      refreshTokenFromCookies,
    );

    this.authService.addRefreshToken(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshToken(res);
    return true;
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async google(@Req() _req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuth(req);

    this.authService.addRefreshToken(res, refreshToken);

    return res.redirect(
      `${process.env["CLIENT_URL"]}/dashboard?access_token=${response.accessToken}`,
    );
  }

  @Get("github")
  @UseGuards(AuthGuard("github"))
  async github(@Req() _req) {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async githubCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuth(req);

    this.authService.addRefreshToken(res, refreshToken);

    return res.redirect(
      `${process.env["CLIENT_URL"]}/dashboard?access_token=${response.accessToken}`,
    );
  }
}
