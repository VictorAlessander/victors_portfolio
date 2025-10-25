class AssetsController < ApplicationController
  def index
    @assets = Asset.all
    render inertia: "Assets/index", props: {data: @assets.as_json}
  end

end
