import Project from "#models/project"

type ProjectCreatePayload = {
  title: string
  description: string
  userId: string
}

type ProjectUpdatePayload = Partial<ProjectCreatePayload>

export default class ProjectService {
  static async create(data: ProjectCreatePayload) {
    const project = await Project.create(data)
    return project
  }

  static async update(project: Project, data: ProjectUpdatePayload) {
    project.merge(data)
    await project.save()
    return project
  }

  static async delete(project: Project) {
    await project.delete()
  }

  static async read(id: string) {
    const project = await Project.query().where('id', id).firstOrFail()
    return project
  }

  static async index() {
    const projects = await Project.query()
    return projects
  }
}