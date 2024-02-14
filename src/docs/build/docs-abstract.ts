import DocsInterface from './docs-interfaces';
import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { CONFIG_OPTIONS_SETUP, DOCS_PATH, SERVER_LOCAL_URI } from './constants';
import { INestApplication} from '@nestjs/common';

export default abstract class DocsAbstract implements DocsInterface {
    private title: string;
    private description: string;
    private version: string;
    private path: string;
    private options: Omit<OpenAPIObject, 'paths'>;

    constructor(
        private readonly app: INestApplication,
        private readonly module: Function
    ) {}

    setPath(path: string): this {
        this.path = path;
        return this;
    }
    setTitle(title: string): this {
        this.title = title;
        return this;
    }
    setDescription(description: string): this {
        this.description = description;
        return this;
    }
    setEndpointVersion(version: string): this {
        this.version = version;
        return this;
    }
    setOptions(opts: SwaggerDocumentOptions = {}): this {
        this.options = new DocumentBuilder()
            .setTitle(this.title)
            .setDescription(this.description)
            .setVersion(this.version)
            .addServer(SERVER_LOCAL_URI, 'Local environment')
            .build();
        this.options = {
            ...this.options,
            ...opts,
        }
        return this;
    }

    build() {
        const document = SwaggerModule.createDocument(this.app, this.options, {
            include: [this.module]
        });
        SwaggerModule.setup(`${DOCS_PATH}/${this.path}`, this.app, document, CONFIG_OPTIONS_SETUP);
    }
}
