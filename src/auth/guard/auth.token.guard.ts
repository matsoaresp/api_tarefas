import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import jwtConfig from "../config/jwt.config";
import type { ConfigType } from "@nestjs/config";


export class AuthTokenGuard implements CanActivate {

    constructor (
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    )
    {}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request: Request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeade(request)
        
        if (!token) {
            throw new UnauthorizedException('Não logado')
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration,
            );
        }catch (error){
            throw new UnauthorizedException('Falha ao logar!')
        }

        return true
    }

    private extractTokenFromHeade(request: Request): string | undefined {
        const authorization = request.headers['authorization'];

        if (!authorization || typeof authorization !== 'string'){
            return undefined;
        }

        const [type, token] = authorization.split('')
        return type === 'Bearer' ? token : undefined
    }
    
}