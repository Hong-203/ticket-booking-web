import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      clientID: GoogleStrategy.getRequiredEnv(
        configService,
        'GOOGLE_CLIENT_ID',
      ),
      clientSecret: GoogleStrategy.getRequiredEnv(
        configService,
        'GOOGLE_CLIENT_SECRET',
      ),
      callbackURL: GoogleStrategy.getRequiredEnv(
        configService,
        'GOOGLE_CALLBACK_URL',
      ),
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  private static getRequiredEnv(
    configService: ConfigService,
    key: string,
  ): string {
    const value = configService.get<string>(key);
    if (!value) {
      throw new BadRequestException(
        `Missing required environment variable: ${key}`,
      );
    }
    return value;
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails } = profile;
      const user = {
        email: emails?.[0]?.value,
        username: name?.givenName + ' ' + name?.familyName,
        accessToken,
      };
      done(null, user);
    } catch (err) {
      this.logger.error(
        `❌ Error in Google validate(): ${err.message}`,
        err.stack,
      );
      done(err);
    }
  }
}
