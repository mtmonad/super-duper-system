pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "newsdarpan-reader"
include(":app")
include(":core:core-designsystem")
include(":core:core-network")
include(":core:core-database")
include(":core:core-datastore")
include(":core:core-model")
include(":core:core-common")
include(":core:core-analytics")
include(":core:core-notifications")
include(":core:core-media")
include(":core:core-ads")
include(":feature:onboarding")
include(":feature:home")
include(":feature:article")
include(":feature:sections")
include(":feature:search")
include(":feature:authors")
include(":feature:saved")
include(":feature:downloads")
include(":feature:liveblog")
include(":feature:webstories")
include(":feature:notifications")
include(":feature:settings")
include(":feature:legal")
include(":feature:utility")
include(":benchmark")
