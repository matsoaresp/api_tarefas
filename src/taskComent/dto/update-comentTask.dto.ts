import { PartialType } from "@nestjs/mapped-types";
import { CreateComentTask } from "./create-comentTask.dto";

export class UpdateComentTask extends PartialType(CreateComentTask) {}

