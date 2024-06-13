import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { CategoriesModule } from 'src/categories/categories.module';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [CategoriesModule, PlayersModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
