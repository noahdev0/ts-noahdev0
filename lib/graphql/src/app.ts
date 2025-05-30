import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { buildSchema } from 'type-graphql';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@database';
import { AuthMiddleware, AuthCheckerMiddleware } from '@middlewares/auth.middleware';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, responseLogger, errorLogger } from '@utils/logger';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public apolloServer: ApolloServer;

  constructor(resolvers) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initApolloServer(resolvers);
    this.initializeErrorHandling();
  }

  public async listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`🎮 http://localhost:${this.port}/graphql`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await dbConnection();
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(hpp());
      this.app.use(helmet());
    }

    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private async initApolloServer(resolvers) {
    const schema = await buildSchema({
      resolvers: resolvers,
      authChecker: AuthCheckerMiddleware,
    });

    this.apolloServer = new ApolloServer({
      schema: schema,
      plugins: [
        this.env === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
      formatError: error => {
        try {
          errorLogger(error);
          return error;
        } catch (err) {
          return new Error(err.message);
        }
      },
      includeStacktraceInErrorResponses: this.env !== 'production',
    });

    await this.apolloServer.start();
    
    this.app.use(
      '/graphql',
      cors({ origin: ORIGIN, credentials: CREDENTIALS }),
      express.json(),
      expressMiddleware(this.apolloServer, {
        context: async ({ req }) => {
          try {
            const user = await AuthMiddleware(req);
            responseLogger(req);
            return { user };
          } catch (error) {
            throw new Error(error);
          }
        },
      }),
    );
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
