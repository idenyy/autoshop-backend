import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  async register(dto: AuthDto) {
    const existingUser = await this.userService.getByEmail(dto.email)
    if (existingUser) throw new BadRequestException('User already exists')

    const user = await this.userService.create(dto)
    const tokens = this.issueTokens(user.id)

    return { user, ...tokens }
  }

  async login(dto: AuthDto) {
    const user = await this.validate(dto)
    const tokens = this.issueTokens(user.id)

    return { user, ...tokens }
  }

  async updateTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken)
    if (!result) throw new UnauthorizedException('Invalid refresh token')

    const user = await this.userService.getById(result.id)
    const tokens = this.issueTokens(user.id)

    return { user, ...tokens }
  }

  issueTokens(userId: string) {
    const data = { id: userId }

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h'
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '15d'
    })

    return { accessToken, refreshToken }
  }

  private async validate(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email)

    if (!user) throw new NotFoundException('User not found')

    return user
  }

  async validateOAuth(req: any) {
    let user = await this.userService.getByEmail(req.user.email)

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: req.user.name,
          email: req.user.email,
          picture: req.user.picture
        },
        include: {
          favorites: true,
          orders: true
        }
      })
    }

    const tokens = this.issueTokens(user.id)

    return { user, ...tokens }
  }

  addRefreshToken(res: Response, refreshToken: string) {
    const expiresIn = new Date()
    expiresIn.setDate(expiresIn.getDate() + 15)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'lax'
    })
  }

  removeRefreshToken(res: Response) {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'lax'
    })
  }
}
