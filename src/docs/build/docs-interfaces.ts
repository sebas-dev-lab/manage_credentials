import { OpenAPIObject, SwaggerDocumentOptions } from "@nestjs/swagger";

export default interface DocsInterface {
  setPath(path: string): this;
  setTitle(title: string): this;
  setDescription(description: string): this;
  setEndpointVersion(version: string): this;
  setOptions(options: SwaggerDocumentOptions): this;
  build();
}
