import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { PostMeklaModule } from './post-mekla/post-mekla.module'; 
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootroot',
      database: 'yt_nest_auth',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    PostMeklaModule,  
    MulterModule.register({
      dest: './uploads', // Destination folder for uploaded files
    }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
